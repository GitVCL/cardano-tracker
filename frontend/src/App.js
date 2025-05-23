import React, { useEffect, useState } from 'react';
import './App.css';

const cryptoList = [
  { name: 'Cardano', symbol: 'ADA', source: 'cardano' },
  { name: 'Bitcoin', symbol: 'BTC', source: 'binance' },
  { name: 'Ethereum', symbol: 'ETH', source: 'binance' },
  { name: 'Solana', symbol: 'SOL', source: 'binance' }
];

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(300);

  const fetchCryptoData = async (crypto) => {
    try {
      if (crypto.source === 'cardano') {
        const res = await fetch("https://cardano-back.onrender.com/api/cardano");
        if (!res.ok) throw new Error("Erro API Cardano");
        const data = await res.json();
        localStorage.setItem("cardanoData", JSON.stringify(data));
        return {
          ...crypto,
          price: data.price,
          change24h: data.change24h,
          marketCap: data.marketCap
        };
      } else {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${crypto.symbol}USDT`);
        if (!res.ok) throw new Error(`Erro API ${crypto.symbol}`);
        const data = await res.json();
        return {
          ...crypto,
          price: parseFloat(data.price),
          change24h: null,
          marketCap: null
        };
      }
    } catch (err) {
      console.error(crypto.symbol, err.message);
      if (crypto.symbol === 'ADA') {
        const cached = localStorage.getItem("cardanoData");
        if (cached) {
          const cachedData = JSON.parse(cached);
          return {
            ...crypto,
            price: cachedData.price,
            change24h: cachedData.change24h,
            marketCap: cachedData.marketCap
          };
        }
      }
      setError(prev => (prev ? prev + ` | ${crypto.symbol}` : `Erro ao atualizar ${crypto.name} (mantendo dados)`));
      return { ...crypto, price: '-', change24h: null, marketCap: null };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const data = await Promise.all(cryptoList.map(fetchCryptoData));
    setCryptoData(data);
    setNextUpdate(300);
    setLoading(false);
  };

  useEffect(() => {
    const cached = localStorage.getItem("cardanoData");
    if (cached) {
      const cardano = JSON.parse(cached);
      setCryptoData(prev => [...prev, {
        name: 'Cardano',
        symbol: 'ADA',
        price: cardano.price,
        change24h: cardano.change24h,
        marketCap: cardano.marketCap,
        source: 'cardano'
      }]);
    }

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

  const getLogo = (symbol) => {
    return {
      ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
      BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png'
    }[symbol];
  };

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

        {cryptoData.map((crypto) => (
          <div className="table-row" key={crypto.symbol}>
            <div className="coin-info">
              <img src={getLogo(crypto.symbol)} alt={crypto.symbol} className="coin-logo" />
              <div>
                <strong>{crypto.name}</strong>
                <span className="ticker">{crypto.symbol}</span>
              </div>
            </div>
            <span>{typeof crypto.price === 'number' ? `$${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}</span>
            <span className={
              crypto.change24h == null
                ? ''
                : crypto.change24h >= 0 ? 'green' : 'red'
            }>
              {crypto.change24h != null ? `${crypto.change24h.toFixed(2)}%` : '-'}
            </span>
            <span>
              {crypto.marketCap != null ? `$${(crypto.marketCap / 1e9).toFixed(2)}B` : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
