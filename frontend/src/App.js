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
      .then(response => {
        if (!response.ok) throw new Error('Erro na resposta da API da Cardano');
        return response.json();
      })
      .then(data => {
        setCardanoData(data);
        setNextUpdate(300);
      })
      .catch(err => {
        console.error("Erro ao buscar Cardano:", err.message);
        setError(prev => prev ? prev + " | Cardano" : "Erro ao atualizar Cardano (mantendo dados)");
      })
      .finally(() => setLoading(false));

    // Bitcoin via Binance
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
      .then(response => {
        if (!response.ok) throw new Error('Erro na API da Binance');
        return response.json();
      })
      .then(data => setBtcData(data))
      .catch(err => {
        console.error("Erro ao buscar BTC:", err.message);
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

  if (loading && !cardanoData) return <p className="loading">Carregando dados da Cardano...</p>;

  return (
    <div className="container">
      <h1 className="title">Cardano Tracker</h1>

      {error && <p className="error">⚠️ {error}</p>}

      {cardanoData && (
        <>
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
        </>
      )}

      {btcData && (
        <div className="btc-container">
          <h2 className="btc-title">Bitcoin (BTC/USDT)</h2>
          <p><strong>Preço:</strong> ${parseFloat(btcData.price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>
        </div>
      )}

      <p className="next-update">Próxima atualização em: {nextUpdate}s</p>
    </div>
  );
}

export default App;
