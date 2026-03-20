require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/User'); 
const bcrypt = require('bcryptjs'); 

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  try {
    const adminExists = await User.findOne({ email: 'uva@clinica.com' });
    if (!adminExists) {
      await User.create({
        nome: 'Secretaria Admin',
        email: 'uva@clinica.com',
        senha: 'uva123', 
        role: 'secretario',
        endereco: { cep: '00000-000', cidade: 'Sistema', uf: 'BR' }
      });
      console.log('Usuário Secretário padrão criado: uva@clinica.com / Senha: uva123');
    }
  } catch (err) {
    console.error('Erro ao criar admin padrão:', err);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});

