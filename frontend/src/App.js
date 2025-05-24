import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState(300);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetch("https://api.binance.com/api/v3/ticker/price")
      .then(res => res.ok ? res.json() : Promise.reject("Erro ao buscar dados da Binance"))
      .then(data => {
        const filtered = data.filter(item => item.symbol.endsWith("USDT"));
        setCryptoData(filtered);
        setNextUpdate(300);
      })
      .catch(err => {
        console.error("Erro:", err);
        setError("Erro ao carregar dados da Binance.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setNextUpdate(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Tracker</h1>
        <span className="next-update">Atualiza em: {nextUpdate}s</span>
      </header>

      {error && <div className="error">⚠️ {error}</div>}

      <div className="table">
        <div className="table-header">
          <span>Par</span>
          <span>Preço</span>
        </div>
        {cryptoData.map((coin) => (
          <div className="table-row" key={coin.symbol}>
            <span>{coin.symbol}</span>
            <span>${parseFloat(coin.price).toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
