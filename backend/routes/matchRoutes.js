const express = require('express');
const router = express.Router();
const { getMatches, getMatchByUserId } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes (both are protected since we need req.user to evaluate overlaps)
router.get('/', protect, getMatches);
router.get('/:userId', protect, getMatchByUserId);

module.exports = router;
