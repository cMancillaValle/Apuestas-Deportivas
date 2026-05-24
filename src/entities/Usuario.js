// src/entities/Usuario.js
// Modelo de dominio — representa la entidad Usuario en memoria

class Usuario {
  /**
   * @param {object} data
   * @param {number} data.id
   * @param {string} data.nombre
   * @param {string} data.email
   * @param {string} data.estado  'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO'
   */
  constructor({ id, email, status_kyc }) {
    this.id         = id;
    this.email      = email;
    this.status_kyc = status_kyc;
  }

  estaActivo() {
    return this.status_kyc === 'VERIFIED';
  }
}

module.exports = Usuario;
