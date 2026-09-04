const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');
const { calculateMatchScore } = require('../utils/matchHelper');

// @desc    Get all users (with optional search, filter, and matching details)
// @route   GET /api/users
// @access  Public / Private (uses optionalProtect middleware)
const getUsers = async (req, res) => {
  try {
    const { search, teach, learn } = req.query;
    let query = {};

    // Exclude the logged-in user themselves from the explore list
    if (req.user) {
      query._id = { $ne: req.user._id };
    }

    // Search query matches name or elements in the teaching/learning skills arrays
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { teachingSkills: { $in: [searchRegex] } },
        { learningSkills: { $in: [searchRegex] } }
      ];
    }

    // Filter by specific teaching skill
    if (teach) {
      query.teachingSkills = { $in: [new RegExp(teach, 'i')] };
    }

    // Filter by specific learning skill
    if (learn) {
      query.learningSkills = { $in: [new RegExp(learn, 'i')] };
    }

    // Find profiles in database
    const users = await User.find(query).select('-password');

    // Calculate match scores if the requester has logged in
    let usersWithScores = users.map(u => {
      const userObj = u.toObject();
      if (req.user) {
        userObj.match = calculateMatchScore(req.user, userObj);
      } else {
        userObj.match = { score: 0, type: 'none', myMatchingTeach: [], theirMatchingTeach: [] };
      }
      return userObj;
    });

    // Sort by match score (highest first) if logged in
    if (req.user) {
      usersWithScores.sort((a, b) => b.match.score - a.match.score);
    }

    res.status(200).json(usersWithScores);
  } catch (error) {
    console.error('Get Users Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving users list' });
  }
};

// @desc    Get user profile details by ID
// @route   GET /api/users/:id
// @access  Public / Private (uses optionalProtect middleware)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userObj = user.toObject();
    if (req.user) {
      // Inject match details against the logged-in user
      userObj.match = calculateMatchScore(req.user, userObj);
    } else {
      userObj.match = { score: 0, type: 'none', myMatchingTeach: [], theirMatchingTeach: [] };
    }

    res.status(200).json(userObj);
  } catch (error) {
    console.error('Get User Profile Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving user profile' });
  }
};

// @desc    Update own user profile
// @route   PUT /api/users/:id
// @access  Private (Protected by JWT middleware)
const updateUserProfile = async (req, res) => {
  try {
    // Authorization Check: ensure logged-in user is editing their own document
    if (req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ message: 'Not authorized to edit this profile' });
    }

    const { name, bio, location, avatar, teachingSkills, learningSkills } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Update properties if provided, otherwise preserve existing values
    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.location = location !== undefined ? location : user.location;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.teachingSkills = teachingSkills !== undefined ? teachingSkills : user.teachingSkills;
    user.learningSkills = learningSkills !== undefined ? learningSkills : user.learningSkills;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      location: updatedUser.location,
      teachingSkills: updatedUser.teachingSkills,
      learningSkills: updatedUser.learningSkills
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Get user dashboard stats, preview matches, and connection request categorizations
// @route   GET /api/users/me/dashboard
// @access  Private (Protected by JWT)
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get current logged-in user profile details
    const currentUser = await User.findById(userId).select('-password');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch all other users to calculate potential matches
    const otherUsers = await User.find({ _id: { $ne: userId } }).select('-password');
    const potentialMatches = otherUsers
      .map(user => {
        const userObj = user.toObject();
        userObj.match = calculateMatchScore(currentUser, userObj);
        return userObj;
      })
      .filter(u => u.match.score > 0)
      .sort((a, b) => b.match.score - a.match.score);

    // 3. Fetch all requests involving the user (incoming pending, outgoing pending, or accepted)
    const requests = await ConnectionRequest.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate('sender', 'name email avatar bio location teachingSkills learningSkills')
    .populate('receiver', 'name email avatar bio location teachingSkills learningSkills');

    // Filter requests
    const incomingPending = requests.filter(r => r.receiver._id.toString() === userId.toString() && r.status === 'pending');
    const outgoingPending = requests.filter(r => r.sender._id.toString() === userId.toString() && r.status === 'pending');
    const acceptedRequests = requests.filter(r => r.status === 'accepted');

    // Build connections list (extract the user profile that is NOT the active user)
    const connections = acceptedRequests.map(r => {
      const isSender = r.sender._id.toString() === userId.toString();
      const connectedUser = isSender ? r.receiver.toObject() : r.sender.toObject();
      connectedUser.match = calculateMatchScore(currentUser, connectedUser);
      // Attach the connection request ID so users can disconnect
      connectedUser.requestId = r._id;
      return connectedUser;
    });

    res.status(200).json({
      user: currentUser,
      stats: {
        teachingCount: currentUser.teachingSkills.length,
        learningCount: currentUser.learningSkills.length,
        matchesCount: potentialMatches.length,
        connectionsCount: connections.length
      },
      matches: potentialMatches.slice(0, 6), // Top 6 preview matches
      incomingRequests: incomingPending,
      outgoingRequests: outgoingPending,
      connections
    });
  } catch (error) {
    console.error('Get Dashboard Error:', error.message);
    res.status(500).json({ message: 'Server error retrieving dashboard statistics' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserProfile,
  getDashboardData
};
