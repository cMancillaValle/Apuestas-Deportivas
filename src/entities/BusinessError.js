// src/entities/BusinessError.js
// Error de negocio controlado — se traduce a HTTP 409 Conflict

class BusinessError extends Error {
  /**
   * @param {string} message   Mensaje descriptivo para el cliente
   * @param {string} [code]    Código interno opcional (ej: 'SALDO_INSUFICIENTE')
   */
  constructor(message, code = 'BUSINESS_RULE_VIOLATION') {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
  }
}

module.exports = BusinessError;
