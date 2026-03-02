/**
 * DilJourney Configuration
 * Update this file for production deployment
 */

window.APP_CONFIG = {
  // Automatically determine if we're on localhost, 127.0.0.1, or opening locally via file://
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
    ? 'http://localhost:5000'
    : 'https://diljourney-backend.onrender.com'
};
