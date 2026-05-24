// src/components/BetDetailModal.jsx
import React from 'react';

export default function BetDetailModal({ betResult, onClose }) {
  if (!betResult) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="glass animate-fade-in" style={{ padding: '2rem', maxWidth: '400px', width: '100%', background: 'var(--bg-card)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--primary)' }}>¡Apuesta Registrada!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Tu apuesta ha sido procesada exitosamente.</p>
        
        <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
          <div style={{ marginBottom: '0.5rem' }}><strong>ID Transacción:</strong> #{betResult.id}</div>
          <div style={{ marginBottom: '0.5rem' }}><strong>Monto Apostado:</strong> ${betResult.monto}</div>
          <div style={{ marginBottom: '0.5rem' }}><strong>Ganancia Potencial:</strong> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>${betResult.ganancia_pot || betResult.posible_ganancia}</span></div>
          <div style={{ marginBottom: '0.5rem' }}><strong>Estado:</strong> {betResult.estado}</div>
          <div><strong>Fecha:</strong> {new Date(betResult.creada_en || betResult.fecha).toLocaleString()}</div>
        </div>

        <button className="btn" style={{ width: '100%' }} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
