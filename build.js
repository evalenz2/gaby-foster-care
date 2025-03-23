// This is a simple build script for Vercel deployment
// It will be executed by Vercel during the build process

import { execSync } from 'child_process';

// Build both client and server code
console.log('Building client and server code...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!');