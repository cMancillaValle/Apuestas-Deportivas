// src/components/WalletPanel.jsx
import React from 'react';

export default function WalletPanel({ 
  user, 
  balance, 
  selectedOdd, 
  match, 
  monto, 
  setMonto, 
  onApostar, 
  isLoading 
}) {
  
  if (!user) {
    return (
      <div className="wallet-panel glass animate-fade-in">
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Inicia sesión para ver tu billetera y realizar apuestas.</p>
        </div>
      </div>
    );
  }

  const potentialWin = selectedOdd ? (parseFloat(monto || 0) * selectedOdd.valor).toFixed(2) : '0.00';
  const hasError = parseFloat(monto) > parseFloat(balance);

  return (
    <div className="wallet-panel glass animate-fade-in">
      <div className="wallet-balance">
        <h3>Saldo Disponible</h3>
        <p className="balance-amount">${parseFloat(balance).toLocaleString('es-CO')}</p>
      </div>

      <div className="bet-slip">
        <h4>Cupón de Apuesta</h4>
        
        {selectedOdd ? (
          <div className="animate-fade-in">
            <div className="slip-item">
              <div className="slip-title">{match?.partido_desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">{selectedOdd.descripcion}</span>
                <span className="slip-odd">{selectedOdd.valor.toFixed(2)}</span>
              </div>
            </div>

            <div className="input-group">
              <label>Monto a apostar (COP)</label>
              <input 
                type="number" 
                min="1000"
                step="1000"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="Ej. 10000"
                style={{ borderColor: hasError ? 'var(--danger)' : 'var(--border)' }}
              />
              {hasError && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>Saldo insuficiente</span>}
            </div>

            <div className="potential-win">
              <span>Ganancia Potencial:</span>
              <span>${Number(potentialWin).toLocaleString('es-CO')}</span>
            </div>

            <button 
              className="btn" 
              style={{ width: '100%' }}
              onClick={onApostar}
              disabled={isLoading || !monto || hasError || monto <= 0}
            >
              {isLoading ? 'Procesando...' : 'Confirmar Apuesta'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            Selecciona una cuota para comenzar a apostar.
          </div>
        )}
      </div>
    </div>
  );
}
