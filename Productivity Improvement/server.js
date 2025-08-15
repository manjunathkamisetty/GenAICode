const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Port configuration
const port = process.env.PORT || 8080;

console.log('=== CP Simulator Express Server ===');
console.log(`Starting server on port: ${port}`);
console.log(`Current directory: ${__dirname}`);
console.log(`Node.js version: ${process.version}`);

// Build path configuration - serve from React build directory
const buildPath = path.join(__dirname, 'cp-simulator', 'build');
console.log(`Build path: ${buildPath}`);

// Show current directory structure for debugging
console.log('Current directory structure:');
fs.readdirSync(__dirname).forEach(item => {
    const itemPath = path.join(__dirname, item);
    const stat = fs.statSync(itemPath);
    console.log(`  ${stat.isDirectory() ? 'DIR' : 'FILE'}: ${item}`);
});

// Check if build directory exists
if (!fs.existsSync(buildPath)) {
    console.log('❌ Build directory not found. Checking cp-simulator directory...');
    const cpSimPath = path.join(__dirname, 'cp-simulator');
    if (fs.existsSync(cpSimPath)) {
        console.log('✅ cp-simulator directory exists');
        console.log('Contents of cp-simulator:');
        fs.readdirSync(cpSimPath).forEach(file => {
            console.log(`  - ${file}`);
        });
    } else {
        console.log('❌ cp-simulator directory not found!');
    }
} else {
    console.log('✅ Build directory exists');
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html found in build directory');
    } else {
        console.log('❌ index.html NOT found in build directory');
        console.log('Contents of build directory:');
        fs.readdirSync(buildPath).forEach(file => {
            console.log(`  - ${file}`);
        });
    }
}

// Serve static files from the React app build directory
app.use(express.static(buildPath));

// Health check endpoint (before catch-all route)
app.get('/health', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  const indexExists = fs.existsSync(indexPath);
  const buildDirExists = fs.existsSync(buildPath);
  
  let buildContents = [];
  if (buildDirExists) {
    try {
      buildContents = fs.readdirSync(buildPath);
    } catch (err) {
      buildContents = ['Error reading directory'];
    }
  }
  
  res.json({ 
    status: indexExists ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    server: 'CP Simulator Express Server',
    buildPath: buildPath,
    buildDirExists: buildDirExists,
    indexExists: indexExists,
    buildContents: buildContents,
    workingDirectory: process.cwd(),
    nodeVersion: process.version,
    port: port
  });
});

// Handle client-side routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log(`Serving request for: ${req.url}`);
  console.log(`Serving file: ${indexPath}`);
  
  // Check if file exists before trying to serve it
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ File not found: ${indexPath}`);
    return res.status(404).send(`
      <h1>Application Error</h1>
      <p>Build files not found. Expected location: ${indexPath}</p>
      <p>Build path: ${buildPath}</p>
      <p>Current working directory: ${process.cwd()}</p>
      <a href="/health">Check Health Status</a>
    `);
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(500).send(`
        <h1>Server Error</h1>
        <p>Error serving application: ${err.message}</p>
        <p>File path: ${indexPath}</p>
        <a href="/health">Check Health Status</a>
      `);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log('==========================================');
  console.log('CP Simulator Server Starting...');
  console.log(`Server running on port: ${port}`);
  console.log(`Build path: ${buildPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('==========================================');
  
  // Verify build files exist
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found at:', indexPath);
  } else {
    console.error('❌ index.html NOT found at:', indexPath);
    console.log('Build directory contents:');
    if (fs.existsSync(buildPath)) {
      fs.readdirSync(buildPath).forEach(file => {
        console.log('  -', file);
      });
    } else {
      console.error('Build directory does not exist:', buildPath);
    }
  }
}); 