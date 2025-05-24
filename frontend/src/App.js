const express = require('express');
const axios = require('axios');
const app = express();

// Lista das 15 criptomoedas (ids da CoinGecko)
const CRYPTOS = [
  "bitcoin", "ethereum", "binancecoin", "solana", "ripple",
  "cardano", "dogecoin", "avalanche-2", "polkadot", "shiba-inu",
  "polygon", "chainlink", "tron", "litecoin", "bitcoin-cash"
];

// Mapeia os ids da CoinGecko para símbolos e nomes
function mapIdToData(id) {
  const map = {
    bitcoin: { symbol: "BTCUSDT", name: "Bitcoin" },
    ethereum: { symbol: "ETHUSDT", name: "Ethereum" },
    binancecoin: { symbol: "BNBUSDT", name: "BNB" },
    solana: { symbol: "SOLUSDT", name: "Solana" },
    ripple: { symbol: "XRPUSDT", name: "XRP" },
    cardano: { symbol: "ADAUSDT", name: "Cardano" },
    dogecoin: { symbol: "DOGEUSDT", name: "Dogecoin" },
    avalanche-2: { symbol: "AVAXUSDT", name: "Avalanche" },
    polkadot: { symbol: "DOTUSDT", name: "Polkadot" },
    shiba-inu: { symbol: "SHIBUSDT", name: "Shiba Inu" },
    polygon: { symbol: "MATICUSDT", name: "Polygon" },
    chainlink: { symbol: "LINKUSDT", name: "Chainlink" },
    tron: { symbol: "TRXUSDT", name: "Tron" },
    litecoin: { symbol: "LTCUSDT", name: "Litecoin" },
    bitcoin-cash: { symbol: "BCHUSDT", name: "Bitcoin Cash" }
  };
  return map[id] || { symbol: id, name: id };
}

app.get('/api/cryptos', async (req, res) => {
  try {
    const ids = CRYPTOS.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const response = await axios.get(url);
    const prices = response.data;

    const result = Object.keys(prices).map(id => {
      const { symbol, name } = mapIdToData(id);
      return {
        symbol,
        name,
        price: prices[id].usd
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar dados da CoinGecko:", error.message);
    res.status(500).json({ error: 'Erro ao buscar dados das criptomoedas' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
