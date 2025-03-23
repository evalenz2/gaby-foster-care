// Script to handle the Vercel build process
console.log('Running Vercel build script...');

// Import necessary modules
const { execSync } = require('child_process');

try {
  // Build the client code with Vite
  console.log('Building client code...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Build server code using esbuild
  console.log('Building server code...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}