// src/controllers/ApuestaController.js
// Capa API / Controlador — recibe HTTP, delega al servicio, traduce errores

const ProcesarApuestaService = require('../services/ProcesarApuestaService');
const PartidoRepository      = require('../repositories/PartidoRepository');
const UsuarioRepository      = require('../repositories/UsuarioRepository');
const ApuestaRepository      = require('../repositories/ApuestaRepository');
const AuthMiddleware         = require('../middleware/AuthMiddleware');
const BusinessError          = require('../entities/BusinessError');

// ─── Esquemas JSON para validación y Swagger ───────────────────
const apuestaBodySchema = {
  type: 'object',
  required: ['usuario_id', 'cuota_id', 'monto'],
  properties: {
    usuario_id: { type: 'integer', minimum: 1, description: 'ID del usuario autenticado' },
    cuota_id:   { type: 'integer', minimum: 1, description: 'ID de la cuota seleccionada' },
    monto:      { type: 'number',  minimum: 1, description: 'Monto apostado en pesos COP' }
  },
  additionalProperties: false
};

const loginBodySchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email' }
  }
};

const errorSchema = {
  type: 'object',
  properties: {
    detail: { type: 'string' },
    code:   { type: 'string' }
  }
};

// ─── Registro de rutas en Fastify ─────────────────────────────
async function apuestaRoutes(fastify) {

  /**
   * GET /api/partidos
   * Devuelve los partidos activos con sus cuotas (Usado por Frontend).
   * Ruta pública.
   */
  fastify.get('/api/partidos', {
    schema: {
      description: 'Obtiene catálogo de partidos activos y sus cuotas',
      tags: ['Catálogo']
    },
    handler: async (_request, reply) => {
      const partidos = await PartidoRepository.findActivosConCuotas();
      return reply.code(200).send(partidos);
    }
  });

  /**
   * POST /api/auth/token
   * Genera un JWT simulado para pruebas académicas.
   * Ruta pública.
   */
  fastify.post('/api/auth/token', {
    schema: {
      description: 'Genera JWT para usuario de prueba (Solo Académico)',
      tags: ['Autenticación'],
      body: loginBodySchema
    },
    handler: async (request, reply) => {
      const { email } = request.body;
      const usuario = await UsuarioRepository.findByEmail(email);

      if (!usuario) {
        return reply.code(404).send({ detail: 'Usuario no encontrado', code: 'NOT_FOUND' });
      }

      const token = AuthMiddleware.generarTokenTest({
        usuario_id: usuario.id,
        email: usuario.email
      });

      return reply.code(200).send({ token, usuario });
    }
  });

  /**
   * POST /api/apuestas
   * Registra una apuesta simple de un usuario sobre una cuota activa.
   * RUTA PROTEGIDA CON JWT.
   */
  fastify.post('/api/apuestas', {
    preHandler: AuthMiddleware.verificar,
    schema: {
      description: 'Registra una apuesta deportiva simple',
      tags: ['Apuestas'],
      security: [{ bearerAuth: [] }],
      body: apuestaBodySchema,
      response: {
        409: errorSchema,
        422: errorSchema,
        500: errorSchema
      }
    },
    handler: async (request, reply) => {
      const { usuario_id, cuota_id, monto } = request.body;

      // Validación extra: asegurarse que el token pertenezca al usuario que apuesta
      if (request.usuarioAutenticado.usuario_id !== usuario_id) {
        return reply.code(403).send({
          detail: 'Forbidden. El token no pertenece al usuario enviado en el payload.',
          code: 'FORBIDDEN_USER_MISMATCH'
        });
      }

      try {
        const resultado = await ProcesarApuestaService.procesarApuesta({
          usuario_id,
          cuota_id,
          monto
        });

        return reply.code(201).send(resultado);

      } catch (err) {
        if (err instanceof BusinessError) {
          return reply.code(409).send({
            detail: err.message,
            code:   err.code
          });
        }
        fastify.log.error(err);
        return reply.code(500).send({
          detail: 'Error interno del servidor.',
          code:   'INTERNAL_ERROR'
        });
      }
    }
  });

  /**
   * GET /api/apuestas/usuario/:usuario_id
   * Devuelve el historial de apuestas de un usuario.
   */
  fastify.get('/api/apuestas/usuario/:usuario_id', {
    preHandler: AuthMiddleware.verificar,
    schema: {
      description: 'Obtiene historial de apuestas del usuario',
      tags: ['Apuestas'],
      security: [{ bearerAuth: [] }]
    },
    handler: async (request, reply) => {
      const { usuario_id } = request.params;

      if (request.usuarioAutenticado.usuario_id !== parseInt(usuario_id)) {
        return reply.code(403).send({
          detail: 'Forbidden. No puede consultar apuestas de otro usuario.',
          code: 'FORBIDDEN_USER_MISMATCH'
        });
      }

      const apuestas = await ApuestaRepository.findByUsuarioId(usuario_id);
      return reply.code(200).send(apuestas);
    }
  });

}

module.exports = apuestaRoutes;
