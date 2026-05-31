import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MatchCard from './components/MatchCard';
import WalletPanel from './components/WalletPanel';
import BetHistory from './components/BetHistory';
import BetDetailModal from './components/BetDetailModal';
import { api } from './services/api';
import './index.css';

function App() {
  const [partidos, setPartidos] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ucbet_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ucbet_token'));
  const [balance, setBalance] = useState(0);
  
  const [selectedOdd, setSelectedOdd] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [monto, setMonto] = useState('');
  
  const [betHistory, setBetHistory] = useState([]);
  const [betResult, setBetResult] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Cargar catálogo inicial
  useEffect(() => {
    api.getPartidos()
      .then(setPartidos)
      .catch(err => showNotification('Error cargando catálogo: ' + err.message, 'error'));
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadUserData = async (currentUser, currentToken) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BILLETERA_URL}/api/billeteras/usuario/${currentUser.id}`);
      if(res.ok) {
        const billetera = await res.json();
        setBalance(billetera.saldoReal);
      } else {
        setBalance(500000); // Fallback visual si Spring Boot no está corriendo al inicio
      }
      
      const history = await api.getHistorialApuestas(currentToken, currentUser.id);
      setBetHistory(history);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && token) {
      loadUserData(user, token);
    }
  }, []);

  const handleLogin = async (email) => {
    try {
      const data = await api.login(email);
      setUser(data.usuario);
      setToken(data.token);
      localStorage.setItem('ucbet_user', JSON.stringify(data.usuario));
      localStorage.setItem('ucbet_token', data.token);
      
      await loadUserData(data.usuario, data.token);

      showNotification('Sesión iniciada correctamente');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleSelectOdd = (cuota, partido) => {
    if (selectedOdd?.cuota_id === cuota.cuota_id) {
      setSelectedOdd(null);
      setSelectedMatch(null);
    } else {
      setSelectedOdd(cuota);
      setSelectedMatch(partido);
    }
  };

  const handleApostar = async () => {
    if (!token || !selectedOdd || !monto) return;
    
    setIsLoading(true);
    try {
      const response = await api.apostar(token, {
        usuario_id: user.id,
        cuota_id: selectedOdd.cuota_id,
        monto: parseFloat(monto)
      });
      
      // Actualizar saldo con la respuesta real del backend distribuido
      setBalance(response.nuevo_saldo);
      
      // Mostrar modal de detalle
      setBetResult(response.apuesta);

      // Refrescar historial
      const history = await api.getHistorialApuestas(token, user.id);
      setBetHistory(history);
      
      // Limpiar cupón
      setSelectedOdd(null);
      setSelectedMatch(null);
      setMonto('');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} onLogin={handleLogin} />
      
      {notification && (
        <div style={{
          position: 'fixed', top: '80px', right: '20px', zIndex: 1000,
          background: notification.type === 'error' ? 'var(--danger)' : 'var(--success)',
          color: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {notification.msg}
        </div>
      )}

      <main className="container">
        <div className="dashboard-grid">
          
          <div className="catalog-section">
            <h2 style={{marginTop: 0, marginBottom: '1.5rem'}}>Eventos Destacados</h2>
            {partidos.length === 0 ? (
              <p className="text-muted">Cargando eventos...</p>
            ) : (
              partidos.map(partido => (
                <MatchCard 
                  key={partido.partido_id} 
                  partido={partido}
                  selectedOdd={selectedOdd}
                  onSelectOdd={handleSelectOdd}
                />
              ))
            )}
          </div>

          <div className="sidebar-section">
            <WalletPanel 
              user={user}
              balance={balance}
              selectedOdd={selectedOdd}
              match={selectedMatch}
              monto={monto}
              setMonto={setMonto}
              onApostar={handleApostar}
              isLoading={isLoading}
            />
            {user && <BetHistory history={betHistory} />}
          </div>

        </div>
      </main>

      <BetDetailModal betResult={betResult} onClose={() => setBetResult(null)} />
    </>
  );
}

export default App;
