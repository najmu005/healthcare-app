const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', '-password').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/doctors/:id/approve
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await User.findByIdAndUpdate(doctor.userId, { isApproved: true });
    res.json({ message: 'Doctor approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const approvedAppointments = await Appointment.countDocuments({ status: 'approved' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const pendingDoctors = await User.countDocuments({ role: 'doctor', isApproved: false });

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
      pendingDoctors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllDoctors, approveDoctor, toggleBlockUser, deleteUser, getDashboardStats };
