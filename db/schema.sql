-- =============================================================
-- SISTEMA DE APUESTAS DEPORTIVAS - UCBet
-- schema.sql - Creación de tablas
-- =============================================================

-- Limpiar tablas si existen (en orden para respetar FK)
DROP TABLE IF EXISTS apuesta_detalle CASCADE;
DROP TABLE IF EXISTS apuesta CASCADE;
DROP TABLE IF EXISTS transaccion CASCADE;
DROP TABLE IF EXISTS billetera CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

DROP TABLE IF EXISTS cuota CASCADE;
DROP TABLE IF EXISTS mercado CASCADE;
DROP TABLE IF EXISTS estadistica_reciente CASCADE;
DROP TABLE IF EXISTS resultado CASCADE;
DROP TABLE IF EXISTS partido CASCADE;
DROP TABLE IF EXISTS equipo CASCADE;
DROP TABLE IF EXISTS liga CASCADE;
DROP TABLE IF EXISTS deporte CASCADE;

-- ─────────────────────────────────────────────
-- CONTEXTO DEPORTIVO
-- ─────────────────────────────────────────────

CREATE TABLE deporte (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE liga (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE equipo (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE partido (
  id SERIAL PRIMARY KEY,
  local_id INT NOT NULL REFERENCES equipo(id),
  visitante_id INT NOT NULL REFERENCES equipo(id),
  liga_id INT NOT NULL REFERENCES liga(id),
  deporte_id INT NOT NULL REFERENCES deporte(id),
  fecha_inicio TIMESTAMP NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('PRE', 'LIVE', 'SETTLED'))
);

CREATE TABLE resultado (
  id SERIAL PRIMARY KEY,
  partido_id INT NOT NULL UNIQUE REFERENCES partido(id),
  goles_local INT,
  goles_visitante INT
);

CREATE TABLE estadistica_reciente (
  id SERIAL PRIMARY KEY,
  equipo_id INT NOT NULL REFERENCES equipo(id),
  ppg_ultimos_5 FLOAT,
  xg_promedio FLOAT,
  elo_rating INT
);

CREATE TABLE mercado (
  id SERIAL PRIMARY KEY,
  partido_id INT NOT NULL REFERENCES partido(id),
  tipo VARCHAR(50) NOT NULL
);

CREATE TABLE cuota (
  id SERIAL PRIMARY KEY,
  mercado_id INT NOT NULL REFERENCES mercado(id),
  valor DECIMAL(10,2) NOT NULL,
  descripcion VARCHAR(100) NOT NULL
);

-- ─────────────────────────────────────────────
-- USUARIOS Y FINANZAS
-- ─────────────────────────────────────────────

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status_kyc VARCHAR(20) NOT NULL CHECK (status_kyc IN ('PENDING', 'VERIFIED', 'REJECTED')),
  autoexclusion_activa BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_registro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE billetera (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE REFERENCES usuario(id),
  saldo_real DECIMAL(12,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE transaccion (
  id SERIAL PRIMARY KEY,
  billetera_id INT NOT NULL REFERENCES billetera(id),
  monto DECIMAL(12,2) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('DEPOSITO', 'RETIRO', 'APUESTA', 'GANANCIA')),
  fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apuesta (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuario(id),
  monto DECIMAL(12,2) NOT NULL,
  posible_ganancia DECIMAL(12,2) NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('PENDIENTE', 'GANADA', 'PERDIDA')),
  fecha TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE apuesta_detalle (
  id SERIAL PRIMARY KEY,
  apuesta_id INT NOT NULL REFERENCES apuesta(id),
  cuota_id INT NOT NULL REFERENCES cuota(id),
  UNIQUE(apuesta_id, cuota_id)
);
