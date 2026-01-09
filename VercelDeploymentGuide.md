# Deploying GovCareAI to Vercel

## Overview

This guide explains how to deploy the GovCareAI application to Vercel. Due to the application's architecture (traditional Node.js/Express backend with MySQL), a direct deployment to Vercel requires some adjustments.

## Current Application Architecture

- **Frontend**: HTML/CSS/JavaScript static files
- **Backend**: Node.js/Express server with MySQL database
- **Features**: Authentication, complaint management, AI scoring, file uploads

## Deployment Strategy

Since Vercel specializes in frontend applications and serverless functions, not traditional Node.js servers, we'll use a hybrid approach:

1. Deploy the frontend to Vercel
2. Host the backend separately (on Heroku, DigitalOcean, etc.)
3. Configure Vercel to proxy API requests to the backend

## Step-by-Step Instructions

### 1. Prepare Your Backend for External Hosting

Before deploying the frontend to Vercel, you need to host your backend application on a platform that supports traditional Node.js applications:

**Options for Backend Hosting:**
- Heroku (free tier available)
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run
- Railway
- Render

### 2. Update the Vercel Configuration

The `vercel.json` file is configured to redirect API calls to your backend:

```json
{
  "version": 2,
  "name": "govcareai-frontend",
  "public": true,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-domain.com/api/$1"
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

Replace `https://your-backend-domain.com` with your actual backend URL.

### 3. Update Frontend API Configuration

All frontend JavaScript files have been updated to use dynamic API base URLs:

- If running locally (localhost), API calls will use relative paths
- If running on Vercel, API calls will use your specified backend URL

You'll need to update the API_BASE_URL in the JavaScript files when you have your backend URL:

In `frontend/js/main.js`, `frontend/js/auth.js`, `frontend/js/admin-dashboard.js`, `frontend/js/track-complaint.js`, and `frontend/js/view-complaint.js`, update this line:

```javascript
: 'https://your-backend-domain.com'; // Replace with your actual backend domain
```

### 4. Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the project root**:
   ```bash
   cd /path/to/govcareai
   vercel --prod
   ```

   Or simply link your GitHub repository to Vercel for automatic deployments.

4. **Alternatively**, use the Vercel dashboard:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect and use the `vercel.json` configuration

### 5. Environment Variables (if needed)

If you have environment-specific configurations, you can set them in the Vercel dashboard:

- Go to your project in the Vercel dashboard
- Navigate to Settings → Environment Variables
- Add any required variables

### 6. Backend Configuration

On your backend server, ensure that:

1. **CORS is configured** to allow requests from your Vercel domain:
   ```javascript
   // In your backend server.js
   app.use(cors({
     origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:3000'] // Add your domains
   }));
   ```

2. **Environment variables** are set for production:
   - `NODE_ENV=production`
   - Database connection details
   - JWT secrets
   - Other sensitive information

## Important Notes

### Database Considerations

- Your MySQL database needs to be accessible from both your backend server and potentially from external sources
- Consider using a cloud database service (like AWS RDS, Google Cloud SQL, or PlanetScale)

### File Uploads

- The application currently stores files in a local `/uploads` directory
- For production, consider implementing cloud storage (AWS S3, Google Cloud Storage)
- Vercel's file system is ephemeral, so local uploads won't persist

### SSL Certificates

- Both your backend and frontend should use HTTPS in production
- Vercel automatically provides SSL for frontend
- Ensure your backend also has SSL enabled

## Troubleshooting

### Common Issues:

1. **API calls failing**: Check that your backend is running and accessible
2. **CORS errors**: Verify CORS settings on your backend
3. **Authentication issues**: Ensure JWT secrets match between frontend and backend
4. **Image display problems**: Check file paths and storage configuration

### Testing the Setup:

1. Access your Vercel-deployed frontend
2. Try to perform actions that require API calls
3. Monitor browser developer tools for any errors
4. Check your backend server logs for incoming requests

## Alternative Approaches

### Full Migration to Serverless (Advanced)

For a complete migration to Vercel's serverless architecture:

1. Convert Express routes to Vercel API routes (`/api/[endpoint].js`)
2. Use a serverless-compatible database (PlanetScale, Supabase, Firebase)
3. Implement file storage using cloud services
4. Refactor database connection handling for serverless functions

This approach requires significant development effort but would allow for full Vercel deployment.

## Support

If you encounter issues during deployment:

1. Check the browser console for errors
2. Verify your backend server is accessible
3. Confirm that CORS settings allow cross-origin requests
4. Review your Vercel and backend logs

For additional help, refer to the Vercel documentation or reach out to the GovCareAI community.