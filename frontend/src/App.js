import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cardanoData, setCardanoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(60); // segundos até próxima atualização

  const fetchData = () => {
    setLoading(true);
    setError(null);

    fetch('http://localhost:3001/api/cardano')
      .then(response => {
        if (!response.ok) throw new Error('Erro na resposta da API');
        return response.json();
      })
      .then(data => {
        setCardanoData(data);
        setLoading(false);
        setNextUpdate(60); // reinicia o contador
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // atualiza a cada 60 segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setNextUpdate(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  if (loading && !cardanoData) return <p className="loading">Carregando dados da Cardano...</p>;
  if (error) return <p className="error">Erro: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">Cardano Tracker</h1>

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

      <button className="button" onClick={fetchData} disabled={loading}>
        {loading ? 'Atualizando...' : 'Atualizar dados'}
      </button>

      <p className="next-update">Próxima atualização em: {nextUpdate}s</p>
    </div>
  );
}

export default App;
