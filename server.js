const express = require('express');
const path = require('path');
const app = express();

// Serve static files from MOODIE folder with proper MIME types
app.use(express.static(path.join(__dirname, 'MOODIE'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// SPA routing - serve index.html for all routes that don't match a file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'MOODIE', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
});
