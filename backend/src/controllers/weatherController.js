const { previsaoTempo } = require('../services/weatherService');

exports.getWeather = async (req, res) => {
  try {
    const { data } = req.query;

    if (!req.user.endereco || !req.user.endereco.cidade) {
      return res.status(400).json({ message: 'Cidade não encontrada no cadastro do usuário.' });
    }
    
    const forecastData = await previsaoTempo(req.user.endereco.cidade);
    
    const dataConsulta = new Date(data).getTime();
    const agora = new Date().getTime();
    
    const limite5Dias = agora + (5 * 24 * 60 * 60 * 1000);

    if (dataConsulta > limite5Dias) {
      return res.status(400).json({ message: 'A previsão só está disponível para agendamentos nos próximos 5 dias.' });
    }
    if (dataConsulta < agora) {
      return res.status(400).json({ message: 'Não é possível ver previsão para datas passadas.' });
    }

    let previsaoMaisProxima = forecastData.list[0];
    let menorDiferenca = Math.abs(dataConsulta - (forecastData.list[0].dt * 1000));

    for (let item of forecastData.list) {
      const diferencaTempo = Math.abs(dataConsulta - (item.dt * 1000));
      if (diferencaTempo < menorDiferenca) {
        menorDiferenca = diferencaTempo;
        previsaoMaisProxima = item;
      }
    }

    previsaoMaisProxima.name = forecastData.city.name;

    res.json(previsaoMaisProxima);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar previsão do tempo', error: error.message });
  }
};