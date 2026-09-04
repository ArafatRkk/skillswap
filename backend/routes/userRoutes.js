const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserProfile, getDashboardData } = require('../controllers/userController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Get all users (uses soft protection to calculate match scores if token is present)
router.get('/', optionalProtect, getUsers);

// Get user dashboard stats (must be placed before :id route!)
router.get('/me/dashboard', protect, getDashboardData);

// Get user profile details by ID (uses soft protection for match details)
router.get('/:id', optionalProtect, getUserById);

// Update profile details (strictly protected)
router.put('/:id', protect, updateUserProfile);

module.exports = router;
