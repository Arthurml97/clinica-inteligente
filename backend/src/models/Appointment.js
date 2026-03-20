const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  paciente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  dataHora: { 
    type: Date, 
    required: [true, 'A data e hora da consulta são obrigatórias'] 
  },
  status: { 
    type: String, 
    enum: ['pendente', 'confirmado', 'cancelado'], 
    default: 'pendente' 
  },
  observacoes: { 
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Appointment', appointmentSchema);