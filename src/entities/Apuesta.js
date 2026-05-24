// src/entities/Apuesta.js
// Modelo de dominio — representa la entidad Apuesta en memoria

class Apuesta {
  /**
   * @param {object} data
   * @param {number} data.id
   * @param {number} data.usuario_id
   * @param {number} data.cuota_id
   * @param {number} data.monto
   * @param {number} data.ganancia_pot
   * @param {string} data.estado
   * @param {string} data.creada_en
   */
  constructor({ id, usuario_id, cuota_id, monto, ganancia_pot, estado, creada_en }) {
    this.id               = id;
    this.usuarioId        = usuario_id;
    this.cuotaId          = cuota_id;
    this.monto            = parseFloat(monto);
    this.gananciaPotencial = parseFloat(ganancia_pot);
    this.estado           = estado;
    this.creadaEn         = creada_en;
  }
}

module.exports = Apuesta;
