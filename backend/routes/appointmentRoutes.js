const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
} = require('../controllers/appointmentController');
const { protect, adminOnly, doctorOnly } = require('../middleware/authMiddleware');

router.post('/book', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/doctor', protect, doctorOnly, getDoctorAppointments);
router.get('/all', protect, adminOnly, getAllAppointments);
router.put('/:id/status', protect, doctorOnly, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
