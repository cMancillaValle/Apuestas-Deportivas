# UCBet — Sistema de Apuestas Deportivas (Módulo de Procesamiento de Apuestas)

> [!NOTE]
> **Proyecto Académico:** Este es un proyecto desarrollado con fines exclusivamente académicos para ilustrar conceptos de arquitectura de software, diseño de sistemas distribuidos, microservicios y comunicación basada en eventos.

Este repositorio contiene la implementación del módulo de **Procesamiento de Apuestas Deportivas (UCBet)**. Se trata de un sistema distribuido y modular que abarca desde la interfaz de usuario hasta la capa de persistencia y mensajería, implementado con prácticas modernas de diseño, microservicios y arquitectura basada en eventos.

---

## ¿Qué hace esta implementación?

La implementación completa de **UCBet** orquesta el flujo de apuestas simples de forma coordinada entre diferentes tecnologías, asegurando transaccionalidad, consistencia eventual y una experiencia de usuario fluida y reactiva.

### 1. Interfaz de Usuario (Frontend React + Vite)
El frontend proporciona una interfaz intuitiva, moderna y con un diseño estético consistente (esquema claro con detalles en verde marca UCBet) que permite al usuario interactuar en tiempo real con la plataforma:
- **Catálogo de Eventos:** Carga dinámicamente los partidos activos y destacados desde el microservicio backend.
- **Detalle Deportivo Avanzado:** Muestra información estadística relevante por partido para guiar al usuario (ELO, xG Promedio de goles esperados, y Puntos Por Partido - PPG).
- **Panel de Billetera y Cupón:** Permite ingresar con un usuario demo (`jose@ucbet.com`), visualizar el saldo disponible, seleccionar cuotas vigentes de cualquier mercado, ingresar el monto a apostar y calcular en tiempo real la ganancia potencial.
- **Historial de Apuestas Dinámico:** Muestra el listado histórico de apuestas realizadas por el usuario y su estado actual (`GANADA`, `PERDIDA`, `PENDIENTE`) de forma automática y reactiva en la barra lateral.
- **Confirmación con Modal de Detalles:** Tras registrar con éxito una apuesta, despliega un modal emergente que confirma los datos clave (Monto apostado, Cuota, Ganancia Potencial y Estado).
- **Persistencia de Sesión:** Implementa almacenamiento en `localStorage` para garantizar que la sesión iniciada no se pierda al recargar la página (F5).
- **Configuración Limpia:** Configurado a través de Vite (`envDir`) para alimentarse dinámicamente y de forma exclusiva de variables de entorno del sistema, evitando URLs hardcodeadas.

### 2. Procesamiento y Lógica (Backend Node.js + Fastify)
El microservicio de Apuestas actúa como la API principal (BFF/Orquestador) que expone los endpoints necesarios para el frontend y ejecuta la validación de negocio clave:
- **Autenticación:** Generación y validación de tokens JWT seguros.
- **Validación del Dominio (Reglas de Negocio):**
  - **RN-01:** El usuario debe existir y encontrarse activo.
  - **RN-02:** El evento deportivo (partido) debe estar activo y aceptar apuestas.
  - **RN-03:** La cuota elegida debe estar vigente en el catálogo actual.
  - **RN-04 (Regla de Oro):** No se permite el registro de apuestas si el monto apostado es mayor al saldo disponible del usuario en su billetera.
- **Orquestación Distribuidora:** Ante una apuesta válida, registra el estado inicial en base de datos local y solicita de forma síncrona mediante HTTP el débito atómico al microservicio de Billetera.
- **Publicación en Broker de Mensajes (Deshabilitado):** Originalmente se diseñó para emitir eventos asíncronos hacia **Apache Kafka** (`apuestas-realizadas`) para la consistencia eventual; sin embargo, por razones de alto consumo de recursos en el entorno de despliegue, Kafka tuvo que ser "eliminado"/deshabilitado de la implementación activa de producción.

- **Documentación Interactiva:** Exposición automática y completa de la especificación de API usando Swagger OpenAPI en `/docs`.

### 3. Gestión Financiera (Backend Java + Spring Boot)
El microservicio de Billetera se encarga de aislar la gestión del saldo real y la contabilidad transaccional de los usuarios:
- **API REST Financiera:** Ofrece consultas rápidas de saldo por usuario y un endpoint para procesar débitos seguros.
- **Validación de Saldo Atómica:** Evalúa de manera aislada y atómica si el usuario posee los fondos necesarios para debitar el monto solicitado por la apuesta, devolviendo el estado final del saldo del usuario.
- **Persistencia Compartida:** Interactúa con el modelo relacional mapeando entidades mediante JPA/Hibernate.
- **Configuración por Entorno:** Carga credenciales y variables dinámicamente a través de JVM arguments extraídos del archivo `.env` global.

### 4. Capa de Datos (PostgreSQL)
Se cuenta con una base de datos relacional robusta con un esquema completo y normalizado:
- **Esquema Físico:** Tablas organizadas para deportes, ligas, equipos, partidos, resultados, estadísticas recientes, mercados, cuotas, usuarios, billeteras, transacciones, apuestas e historial detallado.
- **Carga de Datos de Prueba (Seed):** Inicialización de la base de datos con partidos simulados, cuotas activas para apuestas y un perfil de usuario demo (`jose@ucbet.com`) con balance inicial.

---

## Arquitectura y Flujo de Datos

```
[ FRONTEND REACT ]
       │
       │ (1) POST /api/apuestas (con JWT)
       ▼
[ BACKEND NODE.JS / FASTIFY ] 
       │
       ├─► (2) Valida Usuario, Partido y Cuota en PostgreSQL DB
       │
       ├─► (3) Crea Apuesta PENDIENTE en PostgreSQL DB
       │
       ├─► (4) POST /api/billeteras/debito (HTTP Síncrono)
       │         │
       │         ▼
       │   [ BACKEND JAVA / SPRING BOOT ]
       │         │
       │         ├─► Realiza Validación Atómica de Fondos
       │         └─► Registra Transacción y actualiza Saldo en DB
       │
       ├─► (5) Confirma Apuesta a REGISTRADA en PostgreSQL DB
       │
       └─► (6) [Opcional] Publica evento 'ApuestaRealizada' en Apache Kafka (Deshabilitado en despliegue por consumo de recursos)
```

---

## Tecnologías Utilizadas

- **Frontend:** React, Vite, Vanilla CSS.
- **Backend de Apuestas:** Node.js, Fastify, KafkaJS, JWT, pg-promise.
- **Backend de Billetera:** Java 17, Spring Boot, Spring Data JPA, Hibernate, Maven.
- **Base de Datos:** PostgreSQL.
- **Mensajería:** Apache Kafka (Deshabilitado en despliegue por consumo de recursos), Docker Compose.
- **Configuración General:** Variables de entorno centralizadas (`.env`).
