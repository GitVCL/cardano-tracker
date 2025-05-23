import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cardanoData, setCardanoData] = useState(null);
  const [btcData, setBtcData] = useState(null);
  const [ethData, setEthData] = useState(null);
  const [solData, setSolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(300);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    // Cardano
    fetch("https://cardano-back.onrender.com/api/cardano")
      .then(res => res.ok ? res.json() : Promise.reject("Erro API Cardano"))
      .then(data => {
        setCardanoData(data);
        setNextUpdate(300);
      })
      .catch(err => {
        console.error("Cardano:", err);
        setError(prev => prev ? prev + " | Cardano" : "Erro ao atualizar Cardano (mantendo dados)");
      })
      .finally(() => setLoading(false));

    // Bitcoin
    fetch("https://cardano-back.onrender.com/api/binance/BTCUSDT")
      .then(res => res.ok ? res.json() : Promise.reject("Erro API BTC"))
      .then(data => setBtcData(data))
      .catch(err => {
        console.error("BTC:", err);
        setError(prev => prev ? prev + " | BTC" : "Erro ao atualizar BTC (mantendo dados)");
      });

    // Ethereum
    fetch("https://cardano-back.onrender.com/api/binance/ETHUSDT")
      .then(res => res.ok ? res.json() : Promise.reject("Erro API ETH"))
      .then(data => setEthData(data))
      .catch(err => {
        console.error("ETH:", err);
        setError(prev => prev ? prev + " | ETH" : "Erro ao atualizar ETH");
      });

    // Solana
    fetch("https://cardano-back.onrender.com/api/binance/SOLUSDT")
      .then(res => res.ok ? res.json() : Promise.reject("Erro API SOL"))
      .then(data => setSolData(data))
      .catch(err => {
        console.error("SOL:", err);
        setError(prev => prev ? prev + " | SOL" : "Erro ao atualizar SOL");
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 min
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
        <h1>Cardano Tracker</h1>
        <span className="next-update">Atualiza em: {nextUpdate}s</span>
      </header>

      {error && <div className="error">⚠️ {error}</div>}

      <div className="table">
        <div className="table-header">
          <span>Asset</span>
          <span>Preço</span>
          <span>24h</span>
          <span>Market Cap</span>
        </div>

        {cardanoData && (
          <div className="table-row">
            <div className="coin-info">
              <img src="https://cryptologos.cc/logos/cardano-ada-logo.png" alt="ADA" className="coin-logo" />
              <div>
                <strong>Cardano</strong>
                <span className="ticker">ADA</span>
              </div>
            </div>
            <span>${cardanoData.price.toFixed(4)}</span>
            <span className={cardanoData.change24h >= 0 ? 'green' : 'red'}>
              {cardanoData.change24h.toFixed(2)}%
            </span>
            <span>${(cardanoData.marketCap / 1e9).toFixed(2)}B</span>
          </div>
        )}

        {btcData && (
          <div className="table-row">
            <div className="coin-info">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="BTC" className="coin-logo" />
              <div>
                <strong>Bitcoin</strong>
                <span className="ticker">BTC</span>
              </div>
            </div>
            <span>${btcData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span>-</span>
            <span>-</span>
          </div>
        )}

        {ethData && (
          <div className="table-row">
            <div className="coin-info">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="coin-logo" />
              <div>
                <strong>Ethereum</strong>
                <span className="ticker">ETH</span>
              </div>
            </div>
            <span>${ethData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span>-</span>
            <span>-</span>
          </div>
        )}

        {solData && (
          <div className="table-row">
            <div className="coin-info">
              <img src="https://cryptologos.cc/logos/solana-sol-logo.png" alt="SOL" className="coin-logo" />
              <div>
                <strong>Solana</str
