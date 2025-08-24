const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Setting up Portfolio App for development...\n');

// Always build frontend to pick up latest changes
console.log('📦 Building frontend...');
try {
	execSync('cd frontend && npm run build', { stdio: 'inherit' });
	console.log('✅ Frontend built successfully!\n');
} catch (error) {
	console.error('❌ Failed to build frontend:', error.message);
	process.exit(1);
}

console.log('🔧 Starting backend server...');
console.log('🌍 Your portfolio will be available at: http://localhost:3001');
console.log('🔌 API endpoints available at: http://localhost:3001/api');
console.log('\nPress Ctrl+C to stop the server\n');

try {
	execSync('cd backend && npm run dev', { stdio: 'inherit' });
} catch (error) {
	console.error('❌ Backend server stopped:', error.message);
}
