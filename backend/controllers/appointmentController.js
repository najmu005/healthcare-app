const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @POST /api/appointments/book
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Check for existing appointment at same slot
    const existing = await Appointment.findOne({ doctorId, date, time, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(400).json({ message: 'This time slot is already booked' });

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      symptoms,
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/appointments/my  (patient's appointments)
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/appointments/doctor  (doctor's appointments)
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/appointments/:id/status  (doctor updates status)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    res.json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/appointments/:id/cancel  (patient cancels)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.patientId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/appointments/all  (admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookAppointment, getMyAppointments, getDoctorAppointments, updateAppointmentStatus, cancelAppointment, getAllAppointments };
