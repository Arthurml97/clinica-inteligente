const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.patch('/:id/status', restrictTo('secretario'), updateAppointmentStatus);

module.exports = router;