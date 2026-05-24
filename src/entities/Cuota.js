// src/entities/Cuota.js
// Modelo de dominio — representa la entidad Cuota en memoria

class Cuota {
  /**
   * @param {object} data
   * @param {number} data.cuota_id
   * @param {string} data.cuota_desc
   * @param {number} data.valor
   * @param {boolean} data.vigente
   * @param {number} data.partido_id
   * @param {string} data.partido_desc
   * @param {string} data.partido_estado
   */
  constructor({ cuota_id, cuota_desc, valor, partido_id, equipo_local, equipo_visitante, partido_estado, mercado_tipo }) {
    this.id            = cuota_id;
    this.descripcion   = cuota_desc;
    this.valor         = parseFloat(valor);
    this.partidoId     = partido_id;
    this.equipoLocal   = equipo_local;
    this.equipoVisitante = equipo_visitante;
    this.partidoEstado = partido_estado;
    this.mercadoTipo   = mercado_tipo;
  }

  estaVigente() {
    return true; // Ya no hay columna vigente, se asume válida si existe
  }

  partidoEstaActivo() {
    return ['PRE', 'LIVE'].includes(this.partidoEstado);
  }
}

module.exports = Cuota;
