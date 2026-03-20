const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-senha');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Não autorizado, token inválido ou expirado' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Você não tem permissão para realizar esta ação' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };