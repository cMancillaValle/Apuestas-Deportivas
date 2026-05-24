// src/repositories/UsuarioRepository.js
// Acceso a datos exclusivo del dominio USUARIO — sin lógica de negocio

const pool = require('../../config/database');

const UsuarioRepository = {

  /**
   * Busca un usuario activo por su ID.
   * @param {number} usuarioId
   * @returns {Promise<object|null>}
   */
  async findById(usuarioId) {
    const { rows } = await pool.query(
      'SELECT id, email, status_kyc FROM usuario WHERE id = $1',
      [usuarioId]
    );
    return rows[0] || null;
  },

  /**
   * Busca un usuario por email (para autenticación simulada).
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT id, email, status_kyc FROM usuario WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  }

};

module.exports = UsuarioRepository;
