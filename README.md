# Sistema de Apuestas Deportivas — Módulo Procesamiento de Apuestas

**Universidad Central | Arquitectura de Sistemas I | Grupo No. 3**  
Docente: Elias Buitrago Bolivar

---

## Funcionalidad Implementada

**Módulo:** Procesamiento de Apuesta Simple  
**Regla de negocio principal:** No se permite registrar una apuesta si el monto apostado es superior al saldo disponible en la billetera del usuario.

---

## Arquitectura

```
POST /api/apuestas
      │
      ▼
ApuestaController          ← Capa API / HTTP
      │
      ▼
ProcesarApuestaService     ← Capa de Lógica de Negocio
  RN-01: usuario activo
  RN-02: cuota vigente
  RN-03: partido ACTIVO
  RN-04: saldo >= monto    ← Regla principal
      │
      ▼
ApuestaRepository          ← Capa de Acceso a Datos
      │
      ▼
PostgreSQL                 ← Transacción ACID:
  APUESTA + TRANSACCION + BILLETERA (UPDATE)
```

---

## Cómo ejecutar el proyecto

### Pre-requisitos
- Node.js >= 18
- PostgreSQL >= 14

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con los datos reales de la base de datos

# 3. Crear la base de datos en PostgreSQL
createdb apuestas_deportivas

# 4. Ejecutar el schema (tablas)
npm run db:schema

# 5. Cargar datos de prueba
npm run db:seed

# 6. Iniciar el servidor
npm start          # producción
npm run dev        # desarrollo (nodemon)
```

El servidor queda en: `http://localhost:3000`  
Documentación Swagger: `http://localhost:3000/docs`

---

## Contrato de API

### `POST /api/apuestas`

**Request:**
```json
{
  "usuario_id": 1,
  "cuota_id": 1,
  "monto": 50000
}
```

**Respuesta exitosa — 201 Created:**
```json
{
  "apuesta_id": 1,
  "usuario_id": 1,
  "cuota_id": 1,
  "monto": 50000,
  "ganancia_potencial": 105000,
  "estado": "REGISTRADA",
  "nuevo_saldo": 150000,
  "creada_en": "2025-..."
}
```

**Error — Saldo insuficiente (409 Conflict):**
```json
{ "detail": "Saldo insuficiente para realizar la apuesta.", "code": "SALDO_INSUFICIENTE" }
```

**Error — Partido no disponible (409 Conflict):**
```json
{ "detail": "El evento deportivo ya no acepta apuestas.", "code": "PARTIDO_NO_ACTIVO" }
```

**Error — Cuota inválida (409 Conflict):**
```json
{ "detail": "La cuota seleccionada ya no se encuentra vigente.", "code": "CUOTA_NO_VIGENTE" }
```

---

## Datos de prueba (seed)

| usuario_id | Nombre          | Saldo inicial | Caso de prueba         |
|------------|-----------------|---------------|------------------------|
| 1          | Carlos Mancilla | $200.000      | Apuesta válida         |
| 2          | Esteban Vallejo | $30.000       | Saldo limitado         |
| 3          | Xavier Bravo    | $0            | Saldo insuficiente     |

| cuota_id | Partido              | Descripción        | Vigente | Estado partido |
|----------|----------------------|--------------------|---------|----------------|
| 1        | Real Madrid vs Barça | Victoria R. Madrid | ✅      | ACTIVO         |
| 2        | Real Madrid vs Barça | Empate             | ✅      | ACTIVO         |
| 3        | Real Madrid vs Barça | Victoria Barça     | ❌      | ACTIVO         |
| 4        | Lakers vs Warriors   | Victoria Lakers    | ✅      | ACTIVO         |
| 6        | Nadal vs Djokovic    | Victoria Nadal     | ❌      | FINALIZADO     |

---

## Casos de prueba para evidencias

### ✅ Caso válido
```bash
curl -X POST http://localhost:3000/api/apuestas \
  -H "Content-Type: application/json" \
  -d '{"usuario_id": 1, "cuota_id": 1, "monto": 50000}'
# Esperado: 201 Created
```

### ❌ Saldo insuficiente
```bash
curl -X POST http://localhost:3000/api/apuestas \
  -H "Content-Type: application/json" \
  -d '{"usuario_id": 3, "cuota_id": 1, "monto": 50000}'
# Esperado: 409 Conflict — SALDO_INSUFICIENTE
```

### ❌ Cuota no vigente
```bash
curl -X POST http://localhost:3000/api/apuestas \
  -H "Content-Type: application/json" \
  -d '{"usuario_id": 1, "cuota_id": 3, "monto": 10000}'
# Esperado: 409 Conflict — CUOTA_NO_VIGENTE
```

### ❌ Partido finalizado
```bash
curl -X POST http://localhost:3000/api/apuestas \
  -H "Content-Type: application/json" \
  -d '{"usuario_id": 1, "cuota_id": 6, "monto": 10000}'
# Esperado: 409 Conflict — PARTIDO_NO_ACTIVO
```
