# Deploying GovCareAI to Vercel

## Important Notice

The GovCareAI application is currently designed as a traditional full-stack application with:
- A Node.js/Express backend server
- MySQL database using Sequelize ORM
- File upload functionality
- Persistent database connections

Vercel specializes in hosting frontend applications and serverless functions, not traditional Node.js servers with persistent connections. This creates challenges for direct deployment.

## Deployment Options

### Option 1: Frontend Only Deployment (Recommended for demo purposes)

Deploy only the frontend portion to Vercel and connect it to a separately hosted backend:

1. Modify `vercel.json` to serve only frontend files:

```json
{
  "version": 2,
  "name": "govcareai-frontend",
  "public": true,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-domain.com/api/$1",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. Host your backend separately (on Heroku, DigitalOcean, AWS, etc.)

3. Update frontend API calls to point to your hosted backend URL

### Option 2: Full Migration to Serverless Architecture

This requires significant refactoring of the backend to work with Vercel's serverless functions:

#### Backend Changes Required:

1. Convert Express routes to Vercel API routes (`/api/[endpoint].js`)
2. Implement database connection pooling suitable for serverless
3. Handle file uploads differently (using external services like AWS S3)
4. Remove global state management (like resetCodes)

#### Sample API Route Structure:

Create files in `/api/` folder:

```
/api/
  /auth/
    /login/
      /citizen.js
      /admin.js
    /register.js
    /forgot-password.js
    /reset-password.js
  /complaints/
    /index.js
    /[id].js
  /admin/
    /index.js
    /dashboard.js
  /health.js
```

Example API route (`/api/auth/login/citizen.js`):

```javascript
import { sequelize } from '../../backend/config/db'; // You'll need to adjust this
import { comparePassword } from '../../backend/utils/auth'; // Adjust path as needed
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gmail, password } = req.body;

  try {
    // Your existing login logic here
    // Connect to DB, verify credentials, return token
    // Note: DB connections in serverless need special handling
    
    res.status(200).json({
      message: 'Login successful',
      token: 'generated-token',
      citizen: { /* user data */ }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
```

## Recommended Approach

Given the complexity of the application, I recommend:

1. **For Quick Demo**: Deploy frontend only to Vercel, backend to another platform
2. **For Production**: Consider using a platform like Heroku, DigitalOcean App Platform, or AWS EC2 that supports traditional Node.js applications

## Environment Variables for Vercel

If deploying to Vercel, you'll need to set these environment variables in the Vercel dashboard:

- `DB_HOST`: Database host
- `DB_USER`: Database username  
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: Set to "production"

## File Upload Considerations

The current application stores files locally in the `/uploads` directory. This won't work on Vercel since the file system is ephemeral. Consider:

- Using a cloud storage service (AWS S3, Google Cloud Storage)
- Using a service like Vercel Blob (if available)
- Storing files as Base64 in the database (not recommended for large files)

## Limitations

- Serverless functions have timeout limits (typically 10-60 seconds)
- Cold starts may impact performance
- Database connection management is more complex
- File upload sizes may be limited

## Alternative Deployment Platforms

Consider these platforms better suited for your application architecture:

- **Heroku**: Supports full-stack Node.js applications
- **DigitalOcean App Platform**: Cost-effective for traditional applications
- **AWS Elastic Beanstalk**: Managed service for Node.js applications
- **Google Cloud Run**: Container-based deployment