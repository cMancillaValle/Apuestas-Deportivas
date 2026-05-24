// src/services/GestionSaldoService.js
// Cliente HTTP hacia el microservicio de Billetera (Spring Boot :8080)
// No contiene lógica de negocio — solo comunicación entre servicios

const BusinessError = require('../entities/BusinessError');

const BILLETERA_BASE_URL = process.env.BILLETERA_SERVICE_URL || 'http://localhost:8080';
const TIMEOUT_MS = 5000;

/**
 * Realiza un fetch con timeout configurable.
 */
async function fetchConTimeout(url, opciones) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opciones, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Timeout: el microservicio de Billetera no respondió a tiempo.');
    }
    throw new Error(`Microservicio de Billetera no disponible: ${err.message}`);
  } finally {
    clearTimeout(timer);
  }
}

const GestionSaldoService = {

  /**
   * Consulta el saldo actual de la billetera del usuario.
   *
   * @param {number} usuarioId
   * @returns {Promise<{ billetera_id: number, saldo: number }>}
   */
  async obtenerSaldo(usuarioId) {
    const res = await fetchConTimeout(
      `${BILLETERA_BASE_URL}/api/billeteras/usuario/${usuarioId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) {
      if (res.status === 404) {
        throw new BusinessError(
          'El usuario no tiene una billetera asociada.',
          'BILLETERA_NO_ENCONTRADA'
        );
      }
      throw new Error(`Error al consultar billetera: HTTP ${res.status}`);
    }

    const data = await res.json();
    return { ...data, saldo: data.saldoReal };
  },

  /**
   * Solicita el débito de un monto en la billetera del usuario.
   * El microservicio de Billetera valida saldo suficiente de forma atómica.
   *
   * @param {number} usuarioId
   * @param {number} monto
   * @param {number} apuestaId   ID de referencia lógica (sin FK física)
   * @returns {Promise<{ nuevo_saldo: number }>}
   */
  async solicitarDebito(usuarioId, monto, apuestaId) {
    const res = await fetchConTimeout(
      `${BILLETERA_BASE_URL}/api/billeteras/debito`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          usuarioId,
          monto,
          apuestaId,
          descripcion: `Apuesta registrada #${apuestaId}`
        })
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      // El microservicio de Billetera retorna 409 cuando el saldo es insuficiente
      if (res.status === 409) {
        throw new BusinessError(
          body.detail || 'Saldo insuficiente para realizar la apuesta.',
          'SALDO_INSUFICIENTE'
        );
      }
      throw new Error(`Error en débito de billetera: HTTP ${res.status} — ${body.detail || ''}`);
    }

    return res.json();
  }

};

module.exports = GestionSaldoService;
