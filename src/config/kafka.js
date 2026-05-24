// src/config/kafka.js
// Configuración del productor KafkaJs

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'apuestas-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

const KafkaProducer = {

  /**
   * Conecta el productor al broker de Kafka.
   * Se debe llamar al inicializar el servidor.
   */
  async conectar() {
    try {
      await producer.connect();
      console.log('✅  Conectado a Kafka Broker');
    } catch (error) {
      console.error('❌  Error al conectar con Kafka:', error.message);
      // No bloqueamos el arranque en entorno de desarrollo local si Kafka falta
    }
  },

  /**
   * Desconecta el productor ordenadamente.
   */
  async desconectar() {
    await producer.disconnect();
  },

  /**
   * Publica el evento de que una apuesta ha sido registrada exitosamente.
   *
   * @param {object} apuesta
   */
  async publicarApuestaRealizada(apuesta) {
    try {
      await producer.send({
        topic: 'apuestas-realizadas',
        messages: [
          {
            key: String(apuesta.usuario_id), // Particionamiento por usuario
            value: JSON.stringify(apuesta),
            headers: { eventType: 'ApuestaRealizada' }
          }
        ],
      });
      console.log(`[Kafka] 🚀 Evento 'ApuestaRealizada' publicado. Apuesta ID: ${apuesta.apuesta_id}`);
    } catch (error) {
      console.error('[Kafka] ❌ Error publicando evento:', error.message);
    }
  }

};

module.exports = KafkaProducer;
