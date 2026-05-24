// db/run-seed.js — Ejecuta seed.sql
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('../config/database');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('✅  seed.sql ejecutado correctamente.');
    console.log('   Usuario de prueba: jose@ucbet.com');
  } catch (err) {
    console.error('❌  Error al ejecutar seed.sql:', err.message);
  } finally {
    await pool.end();
  }
})();
