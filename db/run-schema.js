// db/run-schema.js — Ejecuta schema.sql
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('../config/database');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('✅  schema.sql ejecutado correctamente.');
  } catch (err) {
    console.error('❌  Error al ejecutar schema.sql:', err.message);
  } finally {
    await pool.end();
  }
})();
