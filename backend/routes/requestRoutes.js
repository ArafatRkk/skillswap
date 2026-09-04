const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes (all require authentication)
router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.patch('/:id', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
