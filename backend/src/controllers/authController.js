const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, role, endereco } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const user = await User.create({ nome, email, senha, role, endereco });

    res.status(201).json({
      _id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.log("=== DETALHE DO ERRO NO CADASTRO ===", error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(senha))) {
      res.json({
        _id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no login', error: error.message });
  }
};