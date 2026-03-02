const express = require('express');
const path = require('path');
const app = express();

// Serve static files from MOODIE folder with proper MIME types and NO CACHE for JS/CSS
app.use(express.static(path.join(__dirname, 'MOODIE'), {
  setHeaders: (res, filePath) => {
    // Don't cache JS, CSS, HTML files - always fetch fresh
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
      res.setHeader('Content-Type', filePath.endsWith('.js') ? 'application/javascript' : filePath.endsWith('.css') ? 'text/css' : 'text/html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      // Cache images and other assets for 1 month
      res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
  }
}));

// SPA routing - serve index.html for all routes that don't match a file
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.sendFile(path.join(__dirname, 'MOODIE', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
});
