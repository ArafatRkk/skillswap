require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express application
const app = express();

// Connect to MongoDB
connectDB();

// CORS Middleware configuration to allow requests from local and deployed frontend
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
    ) {
      return callback(null, true);
    }
    // Allow all other origins for smooth demonstration
    return callback(null, true);
  },
  credentials: true
}));

// Body parser middleware to handle JSON requests
app.use(express.json());

// Middleware to ensure DB connection in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err.message);
    res.status(500).json({ message: 'Database connection error' });
  }
});

// API health status endpoint (useful for testing server availability)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SkillSwap Backend API is running successfully',
    creator: 'Mohammad Arafat Amin'
  });
});

// Mounting Router Modules
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// Fallback Route for non-existent routes (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Requested endpoint not found' });
});

// Global Error Handler to catch operational/runtime errors and format them nicely
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred on the server',
    // Expose details only if in development mode
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Listen on environment port when running as a standalone server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;

