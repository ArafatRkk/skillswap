const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure a compound index to prevent duplicate request records between the same users
ConnectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
