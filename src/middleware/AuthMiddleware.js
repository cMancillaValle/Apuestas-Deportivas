// src/middleware/AuthMiddleware.js
// Middleware de autenticación JWT (para simulación académica)

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_academico';

const AuthMiddleware = {

  /**
   * Genera un token JWT de prueba.
   * @param {object} payload
   * @returns {string} token
   */
  generarTokenTest(payload) {
    // Expiración rápida para el token (ej: 2 horas)
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  },

  /**
   * Hook para verificar el JWT en las rutas protegidas.
   */
  async verificar(request, reply) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({
          detail: 'No autorizado. Se requiere token JWT válido.',
          code: 'UNAUTHORIZED'
        });
      }

      const token = authHeader.split(' ')[1];
      const decodificado = jwt.verify(token, JWT_SECRET);

      // Inyectar el payload en la petición para uso del controlador
      request.usuarioAutenticado = decodificado;

    } catch (error) {
      return reply.code(401).send({
        detail: 'Token inválido o expirado.',
        code: 'UNAUTHORIZED_INVALID_TOKEN'
      });
    }
  }

};

module.exports = AuthMiddleware;
