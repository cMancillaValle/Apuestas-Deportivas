-- =============================================================
-- seed.sql - Datos de prueba para UCBet
-- =============================================================

-- 1. Usuario de prueba
-- Usuario "Jose" con password "password123" (bcrypt simulado)
INSERT INTO usuario (email, password_hash, status_kyc, autoexclusion_activa, fecha_registro) VALUES
  ('jose@ucbet.com', '$2b$10$examplehashjose', 'VERIFIED', TRUE, NOW() - INTERVAL '10 days');

-- Billetera de Jose
INSERT INTO billetera (usuario_id, saldo_real) VALUES
  (1, 500000.00);

-- 2. Contexto Deportivo
INSERT INTO deporte (nombre) VALUES ('Fútbol');

INSERT INTO liga (nombre) VALUES 
  ('Champions League'),
  ('La Liga'),
  ('Premier League');

INSERT INTO equipo (nombre) VALUES 
  ('Real Madrid'),    -- 1
  ('Barcelona'),      -- 2
  ('Manchester City'),-- 3
  ('Arsenal'),        -- 4
  ('Bayern Munich'),  -- 5
  ('PSG');            -- 6

-- Estadisticas recientes
INSERT INTO estadistica_reciente (equipo_id, ppg_ultimos_5, xg_promedio, elo_rating) VALUES
  (1, 2.6, 2.1, 2050),
  (2, 2.2, 1.9, 1980),
  (3, 2.8, 2.5, 2100),
  (4, 2.4, 2.0, 1950),
  (5, 2.0, 1.8, 1920),
  (6, 1.8, 1.6, 1890);

-- Partidos
-- Activos (PRE)
INSERT INTO partido (local_id, visitante_id, liga_id, deporte_id, fecha_inicio, estado) VALUES
  (1, 2, 2, 1, '2026-06-01 20:00:00', 'PRE'),      -- 1: RM vs BAR (La Liga)
  (3, 4, 3, 1, '2026-06-02 20:00:00', 'PRE');     -- 2: MC vs ARS (Premier League)

-- Finalizados (SETTLED)
INSERT INTO partido (local_id, visitante_id, liga_id, deporte_id, fecha_inicio, estado) VALUES
  (5, 6, 1, 1, NOW() - INTERVAL '2 days', 'SETTLED'); -- 3: BAY vs PSG (Champions League)

-- Resultados
INSERT INTO resultado (partido_id, goles_local, goles_visitante) VALUES
  (3, 2, 1); -- BAY 2 - 1 PSG

-- Mercados
INSERT INTO mercado (partido_id, tipo) VALUES
  (1, '1X2'), -- 1
  (2, '1X2'), -- 2
  (3, '1X2'); -- 3

-- Cuotas
-- Para Partido 1
INSERT INTO cuota (mercado_id, valor, descripcion) VALUES
  (1, 2.10, 'Gana Real Madrid'), -- 1
  (1, 3.40, 'Empate'),           -- 2
  (1, 2.80, 'Gana Barcelona');   -- 3

-- Para Partido 2
INSERT INTO cuota (mercado_id, valor, descripcion) VALUES
  (2, 1.80, 'Gana Manchester City'), -- 4
  (2, 3.60, 'Empate'),               -- 5
  (2, 3.20, 'Gana Arsenal');         -- 6

-- Para Partido 3 (Finalizado)
INSERT INTO cuota (mercado_id, valor, descripcion) VALUES
  (3, 1.90, 'Gana Bayern Munich'), -- 7
  (3, 3.50, 'Empate'),             -- 8
  (3, 3.10, 'Gana PSG');           -- 9

-- 3. Historial de Apuestas (Jose)
-- Apuesta ganada (Partido 3 - Bayern Munich)
INSERT INTO apuesta (usuario_id, monto, posible_ganancia, estado, fecha) VALUES
  (1, 50000.00, 95000.00, 'GANADA', NOW() - INTERVAL '3 days'); -- Apuesta 1

INSERT INTO apuesta_detalle (apuesta_id, cuota_id) VALUES
  (1, 7);

-- Apuesta pendiente (Partido 1 - Real Madrid)
INSERT INTO apuesta (usuario_id, monto, posible_ganancia, estado, fecha) VALUES
  (1, 20000.00, 42000.00, 'PENDIENTE', NOW() - INTERVAL '1 hour'); -- Apuesta 2

INSERT INTO apuesta_detalle (apuesta_id, cuota_id) VALUES
  (2, 1);

-- Transacciones asociadas
INSERT INTO transaccion (billetera_id, monto, tipo, fecha) VALUES
  (1, 500000.00, 'DEPOSITO', NOW() - INTERVAL '10 days'),
  (1, 50000.00, 'APUESTA', NOW() - INTERVAL '3 days'),
  (1, 95000.00, 'GANANCIA', NOW() - INTERVAL '1 day'),
  (1, 20000.00, 'APUESTA', NOW() - INTERVAL '1 hour');
