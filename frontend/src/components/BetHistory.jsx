// src/components/BetHistory.jsx
import React from 'react';

export default function BetHistory({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-muted">No tienes apuestas recientes.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Mis Apuestas</h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {history.map(bet => (
          <div key={bet.id} className="glass" style={{ padding: '1rem', background: 'var(--bg-card)', borderLeft: `4px solid ${bet.estado === 'GANADA' ? 'var(--success)' : bet.estado === 'PERDIDA' ? 'var(--danger)' : '#f59e0b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>{bet.partido_desc}</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {new Date(bet.creada_en).toLocaleString('es-CO')}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              Selección: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{bet.cuota_desc}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Apostado: ${parseFloat(bet.monto).toLocaleString()}</span>
              <span style={{ 
                color: bet.estado === 'GANADA' ? 'var(--success)' : bet.estado === 'PERDIDA' ? 'var(--danger)' : 'var(--text-muted)',
                fontWeight: 'bold'
              }}>
                {bet.estado} {bet.estado === 'GANADA' && `(+$${parseFloat(bet.posible_ganancia).toLocaleString()})`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
