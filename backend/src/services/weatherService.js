const axios = require('axios');

const previsaoTempo = async (cidade) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`);
    return response.data;
  } catch (error) {
    console.error('=== ERRO DA API DE CLIMA ===', error.response?.data || error.message);
    throw new Error('Erro ao buscar previsão do tempo');
  }
};

module.exports = { previsaoTempo };