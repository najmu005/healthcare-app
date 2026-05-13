const express = require('express');
const router = express.Router();
const { getAllUsers, getAllDoctors, approveDoctor, toggleBlockUser, deleteUser, getDashboardStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', toggleBlockUser);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);

module.exports = router;
