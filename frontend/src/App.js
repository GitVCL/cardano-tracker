import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cardanoData, setCardanoData] = useState(null);
  const [btcData, setBtcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(300); // 5 minutos

  const fetchData = () => {
    setLoading(true);
    setError(null);

    // Cardano
    fetch("https://cardano-back.onrender.com/api/cardano")
      .then(res => {
        if (!res.ok) throw new Error("Erro na resposta da API da Cardano");
        return res.json();
      })
      .then(data => {
        setCardanoData(data);
        setNextUpdate(300);
      })
      .catch(err => {
        console.error("Cardano:", err.message);
        setError(prev => prev ? prev + " | Cardano" : "Erro ao atualizar Cardano (mantendo dados)");
      })
      .finally(() => setLoading(false));

    // Bitcoin
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
      .then(res => {
        if (!res.ok) throw new Error("Erro na API da Binance");
        return res.json();
      })
      .then(data => setBtcData(data))
      .catch(err => {
        console.error("BTC:", err.message);
        setError(prev => prev ? prev + " | BTC" : "Erro ao atualizar BTC (mantendo dados)");
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setNextUpdate(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="container">
      <h1 className="title">Crypto Tracker</h1>

      {error && <p className="error">⚠️ {error}</p>}

      {cardanoData && (
        <div className="card glass">
          <h2 className="card-title">Cardano (ADA)</h2>
          <p><strong>Nome:</strong> {cardanoData.name}</p>
          <p><strong>Preço:</strong> ${cardanoData.price.toFixed(4)}</p>
          <p>
            <strong>Variação 24h:</strong>{' '}
            <span className={cardanoData.change24h >= 0 ? 'positive' : 'negative'}>
              {cardanoData.change24h >= 0 ? '+' : ''}
              {cardanoData.change24h.toFixed(2)}%
            </span>
          </p>
          <p><strong>Market Cap:</strong> ${(cardanoData.marketCap / 1e9).toFixed(2)} B</p>
        </div>
      )}

      {btcData && (
        <div className="card glass">
          <h2 className="card-title">Bitcoin (BTC/USDT)</h2>
          <p><strong>Preço:</strong> ${parseFloat(btcData.price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>
        </div>
      )}

      <p className="next-update">🔄 Próxima atualização em: {nextUpdate}s</p>
    </div>
  );
}

export default App;
