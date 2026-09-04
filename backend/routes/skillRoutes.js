const express = require('express');
const router = express.Router();
const { getSkills } = require('../controllers/skillController');

// Public route to fetch all skills
router.get('/', getSkills);

module.exports = router;
