const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: [true, 'O nome é obrigatório'] 
  },
  email: { 
    type: String, 
    required: [true, 'O email é obrigatório'], 
    unique: true,
    lowercase: true
  },
  senha: { 
    type: String, 
    required: [true, 'A senha é obrigatória'],
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['paciente', 'secretario'], 
    default: 'paciente' 
  },
  endereco: {
    cep: String,
    logradouro: String,
    bairro: String,
    cidade: String,
    uf: String
  }
}, { 
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('senha')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

userSchema.methods.matchPassword = async function(senhaInserida) {
  return await bcrypt.compare(senhaInserida, this.senha);
};

module.exports = mongoose.model('User', userSchema);