// src/services/ValidacionCuotaService.js
// Servicio de validación de cuotas y partidos — lógica de negocio pura

const CuotaRepository = require('../repositories/CuotaRepository');
const Cuota           = require('../entities/Cuota');
const BusinessError   = require('../entities/BusinessError');

const ValidacionCuotaService = {

  /**
   * Valida que la cuota exista, esté vigente y pertenezca a un partido activo.
   *
   * @param {number} cuotaId
   * @returns {Promise<Cuota>} La cuota validada como entidad de dominio
   * @throws {BusinessError} Si la cuota no existe, no está vigente o el partido no está activo
   */
  async validar(cuotaId) {
    const datos = await CuotaRepository.findConPartidoById(cuotaId);

    if (!datos) {
      throw new BusinessError(
        `La cuota con id ${cuotaId} no existe.`,
        'CUOTA_NO_ENCONTRADA'
      );
    }

    const cuota = new Cuota(datos);

    if (!cuota.estaVigente()) {
      throw new BusinessError(
        'La cuota seleccionada ya no se encuentra vigente.',
        'CUOTA_NO_VIGENTE'
      );
    }

    if (!cuota.partidoEstaActivo()) {
      throw new BusinessError(
        'El evento deportivo ya no acepta apuestas.',
        'PARTIDO_NO_ACTIVO'
      );
    }

    return cuota;
  }

};

module.exports = ValidacionCuotaService;
