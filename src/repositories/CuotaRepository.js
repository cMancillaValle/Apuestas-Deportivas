// src/repositories/CuotaRepository.js
// Acceso a datos exclusivo del dominio CUOTA — sin lógica de negocio

const pool = require('../../config/database');

const CuotaRepository = {

  /**
   * Obtiene una cuota con la información del partido al que pertenece.
   * @param {number} cuotaId
   * @returns {Promise<object|null>}
   */
  async findConPartidoById(cuotaId) {
    const { rows } = await pool.query(
      `SELECT c.id          AS cuota_id,
              c.descripcion AS cuota_desc,
              c.valor,
              p.id          AS partido_id,
              local.nombre  AS equipo_local,
              vis.nombre    AS equipo_visitante,
              p.estado      AS partido_estado,
              m.tipo        AS mercado_tipo
         FROM cuota c
         JOIN mercado m ON m.id = c.mercado_id
         JOIN partido p ON p.id = m.partido_id
         JOIN equipo local ON p.local_id = local.id
         JOIN equipo vis ON p.visitante_id = vis.id
        WHERE c.id = $1`,
      [cuotaId]
    );
    return rows[0] || null;
  },

  /**
   * Retorna todas las cuotas de un partido activo.
   * @param {number} partidoId
   * @returns {Promise<object[]>}
   */
  async findByPartidoId(partidoId) {
    const { rows } = await pool.query(
      `SELECT c.id, c.descripcion, c.valor, m.tipo
         FROM cuota c
         JOIN mercado m ON m.id = c.mercado_id
        WHERE m.partido_id = $1`,
      [partidoId]
    );
    return rows;
  }

};

module.exports = CuotaRepository;
