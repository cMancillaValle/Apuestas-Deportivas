// src/server.js
// Punto de entrada del microservicio de apuestas
// Node.js + Fastify — Módulo de Procesamiento de Apuestas

require('dotenv').config();

const Fastify       = require('fastify');
const cors          = require('@fastify/cors');
const swagger       = require('@fastify/swagger');
const swaggerUi     = require('@fastify/swagger-ui');
const apuestaRoutes = require('./controllers/ApuestaController');
const KafkaProducer = require('./config/kafka');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    }
  });

  // ── CORS ───────────────────────────────────────────────────
  // Permitir solicitudes del frontend React local (Vite)
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // ── Swagger / OpenAPI ──────────────────────────────────────
  await fastify.register(swagger, {
    openapi: {
      info: {
        title:       'API — Sistema de Apuestas Deportivas',
        description: 'Módulo de Procesamiento de Apuestas (Semana 2) | Universidad Central — Grupo 3',
        version:     '1.0.0'
      },
      servers: [{ url: `http://localhost:${PORT}` }],
      tags: [
        { name: 'Apuestas', description: 'Operaciones del módulo de apuestas' },
        { name: 'Catálogo', description: 'Consulta de partidos y cuotas' },
        { name: 'Autenticación', description: 'Generación de JWT para pruebas' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'full' }
  });

  // ── Rutas ──────────────────────────────────────────────────
  await fastify.register(apuestaRoutes);

  // ── Manejo global de errores de validación (schema) ────────
  fastify.setErrorHandler((error, _request, reply) => {
    if (error.validation) {
      return reply.code(422).send({
        detail: 'Datos de entrada inválidos: ' + error.message,
        code:   'VALIDATION_ERROR'
      });
    }
    fastify.log.error(error);
    reply.code(500).send({ detail: 'Error interno del servidor.', code: 'INTERNAL_ERROR' });
  });

  return fastify;
}

// ── Arranque ───────────────────────────────────────────────────
buildServer().then(async (fastify) => {
  try {
    // Iniciar conexión con Kafka antes de escuchar HTTP
    await KafkaProducer.conectar();

    await fastify.listen({ port: PORT, host: HOST });
    console.log(`\n✅  Microservicio de apuestas corriendo en http://localhost:${PORT}`);
    console.log(`📄  Documentación Swagger:       http://localhost:${PORT}/docs\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
