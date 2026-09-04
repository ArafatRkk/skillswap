const User = require('../models/User');
const { calculateMatchScore } = require('../utils/matchHelper');

// @desc    Get all active matches for the logged-in user (Match score > 0)
// @route   GET /api/matches
// @access  Private (Protected by JWT)
const getMatches = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Find all users excluding the active logged-in user
    const otherUsers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

    // Run matching checks for all users
    const matches = otherUsers
      .map(user => {
        const userObj = user.toObject();
        const matchDetails = calculateMatchScore(currentUser, userObj);
        
        return {
          user: userObj,
          score: matchDetails.score,
          type: matchDetails.type,
          myMatchingTeach: matchDetails.myMatchingTeach,
          theirMatchingTeach: matchDetails.theirMatchingTeach
        };
      })
      // Keep only matches with a score of 1 (Partial) or 2 (Strong)
      .filter(match => match.score > 0)
      // Sort matches (highest score first)
      .sort((a, b) => b.score - a.score);

    res.status(200).json(matches);
  } catch (error) {
    console.error('Get Matches List Error:', error.message);
    res.status(500).json({ message: 'Server error calculating matches list' });
  }
};

// @desc    Get match metrics against a specific target user
// @route   GET /api/matches/:userId
// @access  Private (Protected by JWT)
const getMatchByUserId = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId).select('-password');
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const matchDetails = calculateMatchScore(req.user, targetUser);

    res.status(200).json({
      user: targetUser,
      score: matchDetails.score,
      type: matchDetails.type,
      myMatchingTeach: matchDetails.myMatchingTeach,
      theirMatchingTeach: matchDetails.theirMatchingTeach
    });
  } catch (error) {
    console.error('Get Single Match Info Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving match stats' });
  }
};

module.exports = {
  getMatches,
  getMatchByUserId
};
