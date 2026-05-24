// src/services/ProcesarApuestaService.js
// Capa de Lógica de Negocio — orquesta el flujo distribuido de apuestas

const UsuarioRepository      = require('../repositories/UsuarioRepository');
const ApuestaRepository      = require('../repositories/ApuestaRepository');
const ValidacionCuotaService = require('./ValidacionCuotaService');
const GestionSaldoService    = require('./GestionSaldoService');
const KafkaProducer          = require('../config/kafka');
const BusinessError          = require('../entities/BusinessError');
const Usuario                = require('../entities/Usuario');

const ProcesarApuestaService = {

  /**
   * Procesa una apuesta coordinando con el microservicio de Billetera.
   *
   * Flujo distribuido:
   *  1. Valida usuario (local)
   *  2. Valida cuota y partido (local)
   *  3. Crea registro APUESTA en estado 'PENDIENTE' (local)
   *  4. Solicita débito al microservicio de Billetera (HTTP síncrono)
   *  5. Confirma APUESTA a estado 'REGISTRADA' (local)
   *  6. Emite evento Kafka (asíncrono)
   *
   * @param {object} dto
   * @param {number} dto.usuario_id
   * @param {number} dto.cuota_id
   * @param {number} dto.monto
   * @returns {Promise<object>} Resultado de la apuesta registrada
   */
  async procesarApuesta({ usuario_id, cuota_id, monto }) {

    // ── 1. Validar usuario ─────────────────────────────────
    const datosUsuario = await UsuarioRepository.findById(usuario_id);
    if (!datosUsuario) {
      throw new BusinessError(
        `El usuario con id ${usuario_id} no existe.`,
        'USUARIO_NO_ENCONTRADO'
      );
    }
    const usuario = new Usuario(datosUsuario);
    if (!usuario.estaActivo()) {
      throw new BusinessError(
        `El usuario no se encuentra activo (estado: ${usuario.estado}).`,
        'USUARIO_INACTIVO'
      );
    }

    // ── 2. Validar cuota y partido ─────────────────────────
    const cuota = await ValidacionCuotaService.validar(cuota_id);

    // ── Calcular ganancia potencial ────────────────────────
    const gananciaPotencial = parseFloat((monto * cuota.valor).toFixed(2));

    // ── 3. Consultar Saldo Preventivo (Opcional pero recomendado)
    // Evita crear la apuesta pendiente si sabemos de antemano que fallará
    const { saldo } = await GestionSaldoService.obtenerSaldo(usuario_id);
    if (parseFloat(saldo) < monto) {
      throw new BusinessError(
        'Saldo insuficiente para realizar la apuesta.',
        'SALDO_INSUFICIENTE'
      );
    }

    // ── 4. Crear Apuesta Inicial ───────────────────────────
    // La apuesta nace, el débito confirmará su validez
    const apuesta = await ApuestaRepository.insertar({
      usuarioId: usuario_id,
      cuotaId:   cuota_id,
      monto,
      gananciaPotencial
    });

    // ── 5. Solicitar Débito Atómico (Spring Boot Billetera) ─
    let nuevoSaldo;
    try {
      const response = await GestionSaldoService.solicitarDebito(usuario_id, monto, apuesta.id);
      nuevoSaldo = response.nuevo_saldo;
    } catch (error) {
      // Si el débito falla (por saldo, timeout o error 500)
      // En un flujo más avanzado se actualizaría la apuesta a 'RECHAZADA'
      // o se borraría lógicamente. Aquí lanzaremos el error para cortar el flujo.
      throw error;
    }

    // ── 6. Emitir Evento Asíncrono (Kafka) ─────────────────
    // En segundo plano, publicamos que la apuesta fue exitosa (comentado para simplificar despliegue)
    //await KafkaProducer.publicarApuestaRealizada({
    //  apuesta_id: apuesta.id,
    //  usuario_id: usuario_id,
    //  monto,
    //  estado: apuesta.estado
    //});

    // ── Respuesta de dominio ───────────────────────────────
    return {
      apuesta_id:      apuesta.id,
      usuario_id:      apuesta.usuario_id,
      cuota_id:        apuesta.cuota_id,
      monto:           parseFloat(apuesta.monto),
      ganancia_potencial: gananciaPotencial,
      estado:          apuesta.estado,
      nuevo_saldo:     nuevoSaldo,
      creada_en:       apuesta.creada_en
    };
  }

};

module.exports = ProcesarApuestaService;
