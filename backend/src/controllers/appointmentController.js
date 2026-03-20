const Appointment = require('../models/Appointment');
const { previsaoTempo } = require('../services/weatherService');

exports.createAppointment = async (req, res) => {
  try {
    const { dataHora, observacoes } = req.body;
    const pacienteId = req.user._id;

    const existingAppointment = await Appointment.findOne({ dataHora });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Horário indisponível' });
    }

    const appointment = await Appointment.create({
      paciente: pacienteId,
      dataHora,
      observacoes
    });

    let clima = null;
    if (req.user.endereco && req.user.endereco.cidade) {
      try {
        clima = await previsaoTempo(req.user.endereco.cidade);
      } catch (err) {
        console.error('Falha ao buscar clima', err.message);
      }
    }

    res.status(201).json({ appointment, clima });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar agendamento', error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'paciente') {
      query.paciente = req.user._id;
    }

    const appointments = await Appointment.find(query).populate('paciente', 'nome email endereco');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar agendamento', error: error.message });
  }
};