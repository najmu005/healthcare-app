const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @GET /api/doctors - Get all approved doctors
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = {};
    if (specialization) query.specialization = specialization;

    const doctors = await Doctor.find(query).populate('userId', 'name email phone isApproved isBlocked');
    let result = doctors.filter(d => d.userId && !d.userId.isBlocked && d.userId.isApproved);

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(d =>
        d.userId.name.toLowerCase().includes(s) ||
        d.specialization.toLowerCase().includes(s)
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/doctors/:id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', '-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/doctors/profile/me  (for logged-in doctor)
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', '-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/doctors/profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });

    const { specialization, experience, fees, qualification, hospital, bio, availableSlots } = req.body;
    if (specialization) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (fees !== undefined) doctor.fees = fees;
    if (qualification) doctor.qualification = qualification;
    if (hospital) doctor.hospital = hospital;
    if (bio) doctor.bio = bio;
    if (availableSlots) doctor.availableSlots = availableSlots;

    await doctor.save();
    res.json({ message: 'Profile updated', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/doctors/specializations
const getSpecializations = async (req, res) => {
  try {
    const specs = await Doctor.distinct('specialization');
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllDoctors, getDoctorById, getMyDoctorProfile, updateDoctorProfile, getSpecializations };
