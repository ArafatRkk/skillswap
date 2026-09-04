const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected endpoint (requires valid Authorization: Bearer <token> header)
router.get('/me', protect, getMe);

module.exports = router;
