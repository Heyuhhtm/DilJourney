const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Debug: Log environment variables status
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✓ Set' : '✗ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET');
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN || '✓ Default (7d)');
console.log('PORT:', process.env.PORT || '✓ Default (5000)');
console.log('CLIENT_URL:', process.env.CLIENT_URL || '✓ Default (*)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('=====================================');

// Connect to MongoDB (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// ─── CORS Configuration ────────────────────────────
// Determine allowed origins dynamically
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production') {
      // In production, allow the request to proceed (preflight will be handled)
      callback(null, true);
    } else {
      // In development, also allow
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// ─── Body Parsers ─────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/venues',  require('./routes/venues'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/reviews', require('./routes/reviews'));

// ─── Health Check ─────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    message: '🌿 DilJourney API is running',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🌿 DilJourney API is running',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      auth: '/api/auth',
      venues: '/api/venues',
      profile: '/api/profile',
      reviews: '/api/reviews',
    },
  });
});

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ DilJourney server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for testing
module.exports = app;
