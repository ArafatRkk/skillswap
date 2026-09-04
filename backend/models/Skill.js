const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', SkillSchema);
