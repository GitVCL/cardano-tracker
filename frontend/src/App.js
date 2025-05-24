import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState(300);
  const [error, setError] = useState(null);


  const getLogo = (symbol) => {
  const logos = {
    BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
    XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
    ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
    SHIB: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
    MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    LINK: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    TRX: "https://cryptologos.cc/logos/tron-trx-logo.png",
    LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
    BCH: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png"
  };
  const prefix = symbol.replace('USDT', '');
  return logos[prefix] || '';
};

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
