import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [cardanoData, setCardanoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(300);

  const fetchData = () => {
    setLoading(true);
    setError(null);

    // Cardano (Coingecko)
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

    // Outras criptos (Binance)
    fetch("https://cardano-back.onrender.com/api/cryptos")
      .then(res => res.ok ? res.json() : Promise.reject("Erro API Binance"))
      .then(data => setCryptoData(data))
      .catch(err => {
        console.error("Criptos:", err);
        setError(prev => prev ? prev + " | Criptos" : "Erro ao atualizar criptomoedas (mantendo dados)");
      });
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
    const short = symbol.replace('USDT', '');
    return logos[short] || "";
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

        {cryptoData.map(coin => (
          <div key={coin.symbol} className="table-row">
            <div className="coin-info">
              <img src={getLogo(coin.symbol)} alt={coin.symbol} className="coin-logo" />
              <div>
                <strong>{coin.name}</strong>
                <span className="ticker">{coin.symbol.replace('USDT', '')}</span>
              </div>
            </div>
            <span>${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span>-</span>
            <span>-</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
