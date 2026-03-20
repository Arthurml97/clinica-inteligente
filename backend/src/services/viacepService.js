const axios = require('axios');

const buscarCep = async (cep) => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar CEP');
  }
};

module.exports = { buscarCep };