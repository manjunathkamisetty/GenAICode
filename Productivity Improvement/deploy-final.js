const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 === FINAL CP SIMULATOR DEPLOYMENT SCRIPT ===');
console.log('Timestamp:', new Date().toISOString());
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

try {
    // Step 1: Build the React application
    console.log('\n📦 Step 1: Building React application...');
    const cpSimulatorPath = path.join(__dirname, 'cp-simulator');
    
    if (!fs.existsSync(cpSimulatorPath)) {
        throw new Error('cp-simulator directory not found!');
    }
    
    // Change to cp-simulator directory and build
    process.chdir(cpSimulatorPath);
    console.log('Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
    
    console.log('Building production app...');
    execSync('npm run build:prod', { stdio: 'inherit' });
    
    // Go back to root
    process.chdir(__dirname);
    
    const buildPath = path.join(cpSimulatorPath, 'build');
    if (!fs.existsSync(buildPath)) {
        throw new Error('Build directory was not created!');
    }
    
    console.log('✅ React app built successfully');
    
    // Step 2: Copy build files to root for static serving as fallback
    console.log('\n📋 Step 2: Copying build files to root...');
    
    const filesToCopy = ['favicon.ico', 'logo192.png', 'logo512.png', 'manifest.json', 'robots.txt'];
    
    filesToCopy.forEach(file => {
        const src = path.join(buildPath, file);
        const dest = path.join(__dirname, file);
        
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`  ✅ Copied ${file}`);
        } else {
            console.log(`  ⚠️ Skipped ${file} (not found)`);
        }
    });
    
    // Copy static directory
    const staticSrc = path.join(buildPath, 'static');
    const staticDest = path.join(__dirname, 'static');
    
    if (fs.existsSync(staticSrc)) {
        // Remove existing static directory
        if (fs.existsSync(staticDest)) {
            fs.rmSync(staticDest, { recursive: true });
        }
        
        // Copy static directory
        copyRecursiveSync(staticSrc, staticDest);
        console.log('  ✅ Copied static directory');
    }
    
    // Step 3: Verify files are in place
    console.log('\n🔍 Step 3: Verifying deployment...');
    
    const requiredFiles = ['package.json', 'server.js', 'web.config'];
    let allGood = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(path.join(__dirname, file))) {
            console.log(`  ✅ ${file} exists`);
        } else {
            console.log(`  ❌ ${file} MISSING`);
            allGood = false;
        }
    });
    
    // Check React build
    const reactIndex = path.join(buildPath, 'index.html');
    if (fs.existsSync(reactIndex)) {
        console.log('  ✅ React build/index.html exists');
    } else {
        console.log('  ❌ React build/index.html MISSING');
        allGood = false;
    }
    
    // List root directory contents
    console.log('\n📁 Root directory contents:');
    fs.readdirSync(__dirname).forEach(item => {
        const itemPath = path.join(__dirname, item);
        const stat = fs.statSync(itemPath);
        console.log(`  ${stat.isDirectory() ? 'DIR' : 'FILE'}: ${item}`);
    });
    
    if (allGood) {
        console.log('\n🎉 === DEPLOYMENT COMPLETED SUCCESSFULLY ===');
        console.log('The application is ready for Azure deployment.');
        console.log('Both Node.js server and static fallback are configured.');
    } else {
        console.log('\n❌ === DEPLOYMENT ISSUES DETECTED ===');
        process.exit(1);
    }
    
} catch (error) {
    console.error('\n💥 DEPLOYMENT FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
} 