// src/services/api.js
// Servicio de llamadas al backend

const NODE_API = 'https://apuestas-deportivas-production.up.railway.app/api'
//const NODE_API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3000/api';
// Billetera está en 8080 (usado solo para consultar saldo directo si hiciera falta, 
// aunque lo ideal es que todo pase por el BFF o el microservicio según la arquitectura).
// En este caso, Fastify expone los partidos, auth y procesar apuesta.

export const api = {

  async getPartidos() {
    const res = await fetch(`${NODE_API}/partidos`);
    if (!res.ok) throw new Error('Error al cargar partidos');
    return res.json();
  },

  async login(email) {
    const res = await fetch(`${NODE_API}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Usuario no encontrado');
    return res.json();
  },

  async apostar(token, payload) {
    const res = await fetch(`${NODE_API}/apuestas`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Error al procesar apuesta');
    return data;
  },

  async getHistorialApuestas(token, usuarioId) {
    const res = await fetch(`${NODE_API}/apuestas/usuario/${usuarioId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Error al cargar historial de apuestas');
    return res.json();
  }
};
