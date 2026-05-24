// src/repositories/PartidoRepository.js
// Acceso a datos exclusivo del dominio PARTIDO — sin lógica de negocio

const pool = require('../../config/database');

const PartidoRepository = {

  /**
   * Retorna todos los partidos con sus cuotas vigentes agrupadas.
   * Usado por el frontend para mostrar el catálogo de eventos.
   * @returns {Promise<object[]>}
   */
  async findActivosConCuotas() {
    const { rows } = await pool.query(
      `SELECT
         p.id          AS partido_id,
         local.nombre  AS equipo_local,
         vis.nombre    AS equipo_visitante,
         p.fecha_inicio,
         p.estado,
         -- Estadísticas Locales
         elocal.xg_promedio AS local_xg,
         elocal.elo_rating  AS local_elo,
         elocal.ppg_ultimos_5 AS local_ppg,
         -- Estadísticas Visitantes
         evis.xg_promedio AS vis_xg,
         evis.elo_rating  AS vis_elo,
         evis.ppg_ultimos_5 AS vis_ppg,
         -- Cuotas Agrupadas
         json_agg(
           json_build_object(
             'cuota_id',    c.id,
             'descripcion', c.descripcion,
             'valor',       c.valor,
             'mercado',     m.tipo
           ) ORDER BY c.id
         ) AS cuotas
       FROM partido p
       JOIN equipo local ON p.local_id = local.id
       JOIN equipo vis ON p.visitante_id = vis.id
       LEFT JOIN estadistica_reciente elocal ON elocal.equipo_id = local.id
       LEFT JOIN estadistica_reciente evis ON evis.equipo_id = vis.id
       JOIN mercado m ON m.partido_id = p.id
       JOIN cuota c ON c.mercado_id = m.id
      WHERE p.estado IN ('PRE', 'LIVE')
      GROUP BY 
        p.id, local.nombre, vis.nombre, p.fecha_inicio, p.estado, 
        elocal.xg_promedio, elocal.elo_rating, elocal.ppg_ultimos_5,
        evis.xg_promedio, evis.elo_rating, evis.ppg_ultimos_5
      ORDER BY p.fecha_inicio`
    );
    // Renombrar p.fecha_hora a p.fecha_inicio arriba, porque así está en el schema.
    return rows;
  },

  /**
   * Busca un partido por ID.
   * @param {number} partidoId
   * @returns {Promise<object|null>}
   */
  async findById(partidoId) {
    const { rows } = await pool.query(
      'SELECT id, local_id, visitante_id, liga_id, deporte_id, fecha_inicio, estado FROM partido WHERE id = $1',
      [partidoId]
    );
    return rows[0] || null;
  }

};

module.exports = PartidoRepository;
