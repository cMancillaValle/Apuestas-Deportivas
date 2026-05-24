// src/repositories/ApuestaRepository.js
// Acceso a datos exclusivo del dominio APUESTA — sin lógica de negocio

const pool = require('../../config/database');

const ApuestaRepository = {

  /**
   * Inserta una nueva apuesta en la tabla APUESTA y APUESTA_DETALLE.
   *
   * @param {object} params
   * @param {number} params.usuarioId
   * @param {number} params.cuotaId
   * @param {number} params.monto
   * @param {number} params.gananciaPotencial
   * @returns {Promise<object>} La apuesta creada
   */
  async insertar({ usuarioId, cuotaId, monto, gananciaPotencial }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows: [apuesta] } = await client.query(
        `INSERT INTO apuesta (usuario_id, monto, posible_ganancia, estado)
         VALUES ($1, $2, $3, 'PENDIENTE')
         RETURNING id, usuario_id, monto, posible_ganancia, estado, fecha`,
        [usuarioId, monto, gananciaPotencial]
      );
      
      await client.query(
        `INSERT INTO apuesta_detalle (apuesta_id, cuota_id) VALUES ($1, $2)`,
        [apuesta.id, cuotaId]
      );

      await client.query('COMMIT');
      return apuesta;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  /**
   * Retorna el historial de apuestas de un usuario.
   * @param {number} usuarioId
   * @returns {Promise<object[]>}
   */
  async findByUsuarioId(usuarioId) {
    const { rows } = await pool.query(
      `SELECT a.id, ad.cuota_id, a.monto, a.posible_ganancia, a.estado, a.fecha as creada_en,
              c.descripcion AS cuota_desc, 
              local.nombre || ' vs ' || vis.nombre AS partido_desc
         FROM apuesta a
         JOIN apuesta_detalle ad ON ad.apuesta_id = a.id
         JOIN cuota c ON c.id = ad.cuota_id
         JOIN mercado m ON m.id = c.mercado_id
         JOIN partido p ON p.id = m.partido_id
         JOIN equipo local ON p.local_id = local.id
         JOIN equipo vis ON p.visitante_id = vis.id
        WHERE a.usuario_id = $1
        ORDER BY a.fecha DESC
        LIMIT 20`,
      [usuarioId]
    );
    return rows;
  }

};

module.exports = ApuestaRepository;
