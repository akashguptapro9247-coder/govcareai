/**
 * Utility script to update frontend API URLs for Vercel deployment
 * This script updates the frontend JavaScript files to point to your backend server
 */

const fs = require('fs');
const path = require('path');

// Configuration - update these values for your deployment
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://your-backend-domain.com'; // Replace with your actual backend URL

// Directories to search for JS files
const JS_DIRS = [
  './frontend/js'
];

console.log('Updating API URLs for Vercel deployment...');
console.log(`Using backend API URL: ${BACKEND_API_URL}`);

function updateApiUrlInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Define patterns to replace
  const patterns = [
    { 
      // Replace relative API calls like '/api/auth/login' with full URLs
      regex: /fetch\(['"`]\s*\/api\/([a-zA-Z\/_-]+)['"`]/g, 
      replacement: `fetch('${BACKEND_API_URL}/api/$1'`
    },
    { 
      // Replace other API call patterns
      regex: /['"`]\/api\/([a-zA-Z\/_-]+)['"`]/g, 
      replacement: `'${BACKEND_API_URL}/api/$1'`
    }
  ];
  
  let updatedContent = content;
  let wasUpdated = false;
  
  for (const pattern of patterns) {
    if (updatedContent.match(pattern.regex)) {
      updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
      wasUpdated = true;
    }
  }
  
  if (wasUpdated) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Process all JS files in the specified directories
JS_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.filter(file => file.endsWith('.js')).forEach(file => {
      const filePath = path.join(dir, file);
      updateApiUrlInFile(filePath);
    });
  }
});

console.log('API URL update completed!');
console.log('\nRemember to:');
console.log('1. Set your BACKEND_API_URL environment variable or update the script with your backend URL');
console.log('2. Deploy your backend to a platform that supports Node.js applications (Heroku, DigitalOcean, etc.)');
console.log('3. Update the destination URL in vercel.json to match your backend URL');