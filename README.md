# UCBet

## Sistema distribuido de procesamiento de apuestas deportivas

**Proyecto académico**  
Universidad Central, Bogotá, Colombia

UCBet es un proyecto académico orientado al diseño e implementación de un sistema distribuido para el procesamiento de apuestas deportivas. Su arquitectura modular integra una interfaz web, servicios backend desarrollados con tecnologías diferentes y una base de datos relacional.

El proyecto permite estudiar conceptos de arquitectura de software, microservicios, comunicación entre servicios, validación de reglas de negocio y gestión transaccional de operaciones financieras.

> Este proyecto tiene fines exclusivamente académicos. No constituye una plataforma de apuestas operativa ni está destinado a recibir dinero real.

## Tecnologías

### Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

### Backend de apuestas

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

### Backend de billetera

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)](https://maven.apache.org/)

### Base de datos e infraestructura

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)

> Kafka está contemplado en el diseño, pero su integración se encuentra deshabilitada en la implementación actual.

## Funcionalidades principales

### Interfaz web

El frontend proporciona una interfaz para consultar eventos deportivos y gestionar las operaciones de apuesta de un usuario de demostración.

- Catálogo de eventos deportivos y partidos disponibles.
- Visualización de estadísticas y cuotas.
- Consulta del saldo disponible en la billetera.
- Selección de mercados y cálculo de ganancias potenciales.
- Registro y consulta del historial de apuestas.
- Confirmación de operaciones mediante ventanas de detalle.
- Persistencia de la sesión en el navegador.

### Procesamiento de apuestas

El backend desarrollado con Node.js y Fastify coordina las solicitudes del frontend y aplica las reglas de negocio correspondientes.

- Autenticación mediante tokens JWT.
- Validación del estado del usuario y del evento deportivo.
- Comprobación de la vigencia de las cuotas seleccionadas.
- Validación del monto solicitado frente al saldo disponible.
- Registro y seguimiento del estado de las apuestas.
- Comunicación HTTP con el microservicio de billetera.
- Documentación interactiva de la API mediante Swagger y OpenAPI.

### Gestión de billetera

El microservicio desarrollado con Java y Spring Boot concentra las operaciones relacionadas con el saldo del usuario.

- Consulta del saldo disponible.
- Validación de fondos antes de realizar un débito.
- Registro de transacciones financieras.
- Actualización del saldo mediante operaciones transaccionales.
- Persistencia de entidades mediante Spring Data JPA e Hibernate.

### Persistencia de datos

PostgreSQL proporciona el almacenamiento relacional de la aplicación.

El modelo contempla entidades para usuarios, billeteras, transacciones, apuestas, eventos deportivos, partidos, equipos, mercados y cuotas.

También se contempla la inicialización de datos de prueba para facilitar las demostraciones y las pruebas funcionales.

## Arquitectura general

UCBet utiliza una arquitectura distribuida en la que cada servicio tiene una responsabilidad específica.

| Componente | Responsabilidad |
|---|---|
| Frontend | Presentación de eventos, cuotas, billetera e historial de apuestas. |
| Backend de apuestas | Validación de reglas de negocio y coordinación del registro de apuestas. |
| Backend de billetera | Validación de fondos, débitos y actualización del saldo. |
| PostgreSQL | Persistencia de los datos del sistema. |
| Apache Kafka | Componente previsto para la publicación de eventos, actualmente deshabilitado en el despliegue descrito. |

### Flujo de procesamiento

1. El usuario selecciona un evento, un mercado y una cuota.
2. El frontend envía la solicitud de apuesta al backend.
3. El backend valida el usuario, el evento, la cuota y el monto solicitado.
4. Se registra la operación de acuerdo con el flujo de procesamiento implementado.
5. El backend solicita al microservicio de billetera el débito correspondiente.
6. La billetera valida los fondos y procesa la transacción.
7. El backend actualiza el estado de la apuesta según el resultado de la operación.
8. El frontend presenta la confirmación y actualiza el historial.

El flujo describe el comportamiento previsto por la arquitectura. La atomicidad global y la recuperación ante fallos entre servicios deben evaluarse de acuerdo con la implementación efectiva.

## Estado de la mensajería

El proyecto contempla Apache Kafka como mecanismo de publicación de eventos para explorar la comunicación asíncrona y la consistencia eventual.

Sin embargo, Kafka se encuentra deshabilitado en la implementación activa descrita debido al consumo de recursos del entorno de despliegue.

Por tanto, el flujo principal documentado utiliza comunicación HTTP síncrona entre el backend de apuestas y el microservicio de billetera. La publicación de eventos mediante Kafka no debe considerarse operativa mientras permanezca deshabilitada.

## Estructura del proyecto

La organización del repositorio separa la interfaz web, el servicio de apuestas y el servicio de billetera.

```text
UCBet/
├── frontend/
│   └── src/
├── backend-apuestas/
│   └── src/
├── backend-billetera/
│   └── src/
├── docker-compose.yml
├── .env.example
└── README.md
```

Esta estructura es ilustrativa. Los nombres de los directorios deben ajustarse a los que existan realmente en el repositorio.

## Requisitos

El entorno de desarrollo puede requerir las siguientes herramientas, según la configuración del proyecto:

- Node.js y npm para el frontend y el backend de apuestas.
- Java 17 o la versión definida por el proyecto.
- Maven para gestionar las dependencias del microservicio de billetera.
- PostgreSQL para la persistencia de datos.
- Docker y Docker Compose si se utiliza el despliegue mediante contenedores.

Las versiones y dependencias definitivas deben verificarse en los archivos de configuración de cada servicio.

## Configuración

1. Clona el repositorio.
2. Revisa los archivos de configuración del frontend y de los servicios backend.
3. Configura las variables de entorno requeridas.
4. Prepara la base de datos PostgreSQL y los datos iniciales.
5. Instala las dependencias de los servicios.
6. Inicia los componentes siguiendo las instrucciones de desarrollo del proyecto.

No publiques contraseñas, tokens JWT, credenciales de bases de datos ni otros secretos en el repositorio.

Los comandos exactos de instalación y ejecución deben documentarse de acuerdo con la estructura y la configuración vigentes.

## Estado del proyecto

UCBet es una implementación académica orientada al estudio de sistemas distribuidos y procesamiento transaccional.

Entre las áreas de interés del proyecto se encuentran:

- Validación de reglas de negocio.
- Comunicación entre microservicios.
- Coordinación de operaciones entre apuestas y billetera.
- Persistencia relacional y gestión transaccional.
- Autenticación y gestión de sesiones.
- Exploración de arquitecturas basadas en eventos.

Las funcionalidades y los mecanismos de mensajería deben evaluarse según su estado real de implementación y despliegue.

## Contexto académico

UCBet se desarrolla con fines académicos para aplicar conceptos de arquitectura de software, diseño de sistemas distribuidos y comunicación entre servicios.

El proyecto permite estudiar la separación de responsabilidades, la coordinación de operaciones financieras simuladas y los retos de mantener la consistencia de los datos en una arquitectura modular.

## Repositorio

El código fuente y la documentación del proyecto se encuentran disponibles en este repositorio.
