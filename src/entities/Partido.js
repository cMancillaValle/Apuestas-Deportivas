// src/entities/Partido.js
// Modelo de dominio — representa la entidad Partido en memoria

class Partido {
  /**
   * @param {object} data
   * @param {number} data.id
   * @param {string} data.descripcion
   * @param {string} data.deporte
   * @param {string} data.fecha_hora
   * @param {string} data.estado
   */
  constructor({ id, descripcion, deporte, fecha_hora, estado }) {
    this.id          = id;
    this.descripcion = descripcion;
    this.deporte     = deporte;
    this.fechaHora   = fecha_hora;
    this.estado      = estado;
  }

  estaActivo() {
    return this.estado === 'ACTIVO';
  }
}

module.exports = Partido;
