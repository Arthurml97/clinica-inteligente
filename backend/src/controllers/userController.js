const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'paciente' }).select('-senha');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
};