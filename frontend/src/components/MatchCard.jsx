// src/components/MatchCard.jsx
import React from 'react';

export default function MatchCard({ partido, selectedOdd, onSelectOdd }) {
  const date = new Date(partido.fecha_inicio).toLocaleString('es-CO', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="match-card glass animate-fade-in">
      <div className="match-header">
        <span>Fútbol</span>
        <span>{date}</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{partido.equipo_local}</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            ELO: {partido.local_elo} | xG: {partido.local_xg} | PPG: {partido.local_ppg}
          </div>
        </div>
        
        <div style={{ padding: '0 1rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>VS</div>
        
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{partido.equipo_visitante}</h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            ELO: {partido.vis_elo} | xG: {partido.vis_xg} | PPG: {partido.vis_ppg}
          </div>
        </div>
      </div>
      
      <div className="odds-grid">
        {partido.cuotas && partido.cuotas.map(cuota => {
          const isSelected = selectedOdd?.cuota_id === cuota.cuota_id;
          return (
            <div 
              key={cuota.cuota_id}
              className={`odd-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectOdd(cuota, partido)}
            >
              <span className="odd-desc">{cuota.descripcion}</span>
              <span className="odd-val">{parseFloat(cuota.valor).toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
