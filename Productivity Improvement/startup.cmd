@echo off
echo === FORCING NODE.JS EXECUTION ===
echo Current directory: %cd%
echo Node version: 
node --version
echo NPM version:
npm --version
echo Starting Node.js server explicitly...
node server.js 