const Skill = require('../models/Skill');

// @desc    Get all predefined skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    // Find all skills and sort them alphabetically by name
    const skills = await Skill.find({}).sort({ name: 1 });
    res.status(200).json(skills);
  } catch (error) {
    console.error('Get Skills Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving skills' });
  }
};

module.exports = { getSkills };
