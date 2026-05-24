// src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ user, onLogin }) {
  return (
    <nav className="navbar glass">
      <div className="brand">UCBet</div>
      
      <div className="user-section">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Hola, {user.email.split('@')[0]}
            </span>
            <div 
              style={{
                width: '35px', height: '35px', 
                borderRadius: '50%', background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: 'white'
              }}
            >
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <button className="btn btn-secondary text-dark" style={{ color: 'black' }} onClick={() => onLogin('jose@ucbet.com')}>
            Ingresar (Demo)
          </button>
        )}
      </div>
    </nav>
  );
}
