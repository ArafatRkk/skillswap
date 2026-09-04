const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper function to sign JWT tokens (expires in 30 days)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check that all required inputs are present
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check password length constraint
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check password confirmation matching
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user is already registered under this email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new User document
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      // Respond with the newly created profile data and the active JWT token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        teachingSkills: user.teachingSkills,
        learningSkills: user.learningSkills,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server registration error. Please try again' });
  }
};

// @desc    Authenticate user and return JWT
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request inputs
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare input password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Respond with profile data and active session token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      teachingSkills: user.teachingSkills,
      learningSkills: user.learningSkills,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server login error. Please try again' });
  }
};

// @desc    Get current logged in user context details
// @route   GET /api/auth/me
// @access  Private (Protected by JWT middleware)
const getMe = async (req, res) => {
  try {
    // req.user has already been populated in middleware
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({ message: 'Server context error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
