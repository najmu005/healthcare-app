const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, getMyDoctorProfile, updateDoctorProfile, getSpecializations } = require('../controllers/doctorController');
const { protect, doctorOnly } = require('../middleware/authMiddleware');

router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/profile/me', protect, doctorOnly, getMyDoctorProfile);
router.put('/profile', protect, doctorOnly, updateDoctorProfile);
router.get('/:id', getDoctorById);

module.exports = router;
