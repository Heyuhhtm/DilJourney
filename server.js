const express = require('express');
const path = require('path');
const app = express();

// Middleware to set correct MIME types and prevent caching
app.use((req, res, next) => {
  // Don't cache any files
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Set MIME types
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  } else if (req.url.endsWith('.json')) {
    res.setHeader('Content-Type', 'application/json');
  } else if (req.url.endsWith('.html')) {
    res.setHeader('Content-Type', 'text/html');
  }
  
  next();
});

// Serve static files from MOODIE folder
app.use(express.static(path.join(__dirname, 'MOODIE')));

// SPA routing - serve index.html for all routes that don't match a file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'MOODIE', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
});
