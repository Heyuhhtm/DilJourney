# 📱 Complete Render Deployment Guide for DilJourney

## Prerequisites
- [ ] GitHub account with your project pushed
- [ ] Render account (render.com)
- [ ] MongoDB Atlas account with connection string
- [ ] Secure JWT_SECRET generated

---

## Part 1: Backend Deployment on Render

### Step 1: Create New Web Service on Render
1. Visit [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → Select "Web Service"
3. Connect your GitHub repository
4. Select the `backend/` directory (if monorepo) or main repo
5. Configure:
   - **Name**: `diljourney-backend` (must match backend folder if needed)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or paid (your choice)

### Step 2: Set Environment Variables
In Render Dashboard:
1. Go to your Web Service → Environment
2. Add these variables:

```
MONGO_URI=mongodb+srv://heyuhhtm:cody01@cluster0.nvsmwe6.mongodb.net/?appName=Cluster0
JWT_SECRET=[PASTE_YOUR_GENERATED_SECRET_HERE]
JWT_EXPIRES_IN=7d
PORT=10000
CLIENT_URL=https://[YOUR-FRONTEND-RENDER-URL]
NODE_ENV=production
```

⚠️ **Important**:
- `PORT`: Render assigns a dynamic port, but using 10000 is safe
- `JWT_SECRET`: Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `CLIENT_URL`: Will get this after deploying frontend

### Step 3: Deploy Backend
1. Click "Deploy" button on Render
2. Wait for build to complete
3. Check Logs for "✅ DilJourney server running on port..."
4. **Copy your backend URL**: `https://diljourney-backend.render.com` (your actual URL from Render)

### Step 4: Verify Backend is Working
Open in browser:
```
https://[your-backend-url].onrender.com/health
```

Should return:
```json
{
  "message": "🌿 DilJourney API is running",
  "version": "1.0.0",
  "status": "OK",
  "timestamp": "2026-03-02T..."
}
```

---

## Part 2: Frontend Deployment

### Step 1: Update config.js with Backend URL
**File**: `MOODIE/js/config.js`

```javascript
/**
 * DilJourney Configuration
 * Update this file for production deployment
 */

window.APP_CONFIG = {
  // For local development vs production
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
    ? 'http://localhost:5000'  // Local development
    : 'https://diljourney-backend.render.com'  // ← CHANGE TO YOUR BACKEND URL
};
```

### Step 2: Create a Render Configuration File
Create **`render.yaml`** in your project root (not in backend folder):

```yaml
services:
  - type: web
    name: diljourney-frontend
    runtime: static
    buildCommand: echo "No build needed"
    staticPublishPath: ./MOODIE
    routes:
      - path: "/*"
        destination: /index.html
```

This tells Render to:
- Serve static files from `MOODIE` folder
- Handle client-side routing by serving index.html for all routes

### Step 3: Deploy Frontend to Render

Option A: Using Render Dashboard (Manual)
1. Click "New Web Service"
2. Connect GitHub repo
3. Configure as Static Site + point to MOODIE folder
4. Click Deploy

Option B: Using render.yaml (Recommended)
1. Commit render.yaml to GitHub
2. Connect repo to Render
3. Render will auto-detect and deploy

### Step 4: Get Frontend URL
After deployment, Render gives you: `https://diljourney-frontend.render.com`

---

## Part 3: Update Backend with Frontend URL

Now that frontend is deployed, update your backend:

1. Go to Backend Service in Render Dashboard
2. Go to Environment Variables
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://diljourney-frontend.render.com
   ```
4. Click "Save" (triggers redeploy)

---

## Testing Signup/Login on Render

### Test 1: Open Frontend
1. Visit: `https://diljourney-frontend.render.com`
2. Click "Get Started"
3. Should see signup form

### Test 2: Signup
1. Fill in form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: Test123456
2. Click "Create Account"
3. Check browser console (F12 → Console) for errors

### Test 3: Check Network Requests
1. Press F12 (Developer Tools)
2. Go to "Network" tab
3. Try signup again
4. Look for request to: `/api/auth/register`
5. Check response (should be 201 status with token)

### Test 4: Check Backend Logs
Render Dashboard → Backend Service → Logs
Look for:
- MongoDB connection logs
- Registration success message
- JWT token generation

---

## Common Issues & Solutions

### ❌ Issue: "Cannot reach backend" or 404 errors
**Solution**:
- Verify backend URL in config.js matches your Render URL
- Check backend service is running (see logs in Render)
- Ensure all env variables are set → redeploy backend

```javascript
// Debug: Add to browser console to check config
console.log('API Base URL:', window.APP_CONFIG.apiUrl);
```

### ❌ Issue: "Invalid token" or JWT errors
**Solution**:
- Ensure JWT_SECRET is set on Render
- Regenerate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Update on Render → redeploy

### ❌ Issue: MongoDB connection fails
**Solution**:
- Check MongoDB Atlas IP whitelist
  1. Login to MongoDB Atlas
  2. Security → Network Access
  3. Add `0.0.0.0/0` (allow all) or add Render's IP
- Verify MONGO_URI is correct

### ❌ Issue: Static files (CSS, JS) not loading
**Solution**:
- Ensure render.yaml points to correct `staticPublishPath`: `./MOODIE`
- Check all file references are relative paths
- Verify all script tags use correct paths

### ❌ Issue: CORS errors
**Solution**:
- Already configured in backend for production
- If still issues, check browser console for exact error
- May need to add frontend URL to CORS allowedOrigins

---

## Environment Variables Checklists

### Backend (.env on Render)
```
✅ MONGO_URI=mongodb+srv://...
✅ JWT_SECRET=[32-char random string]
✅ JWT_EXPIRES_IN=7d
✅ PORT=10000
✅ CLIENT_URL=https://diljourney-frontend.render.com
✅ NODE_ENV=production
```

### Frontend (config.js)
```
✅ apiUrl points to correct backend URL
✅ Uses https:// for Render URLs
✅ Falls back to localhost:5000 for local development
```

---

## Deployment Checklist

### Before Deploying
- [ ] All code committed to GitHub
- [ ] Generated secure JWT_SECRET
- [ ] Updated DATABASE credentials if needed
- [ ] Tested locally (npm run dev / npm start)
- [ ] No console errors in browser
- [ ] No console errors on backend

### Backend on Render
- [ ] Created Web Service
- [ ] Set all 6 environment variables
- [ ] Deployed successfully
- [ ] `/health` endpoint returns 200
- [ ] Backend URL copied

### Frontend on Render
- [ ] Updated config.js with backend URL
- [ ] Created render.yaml (optional but recommended)
- [ ] Deployed successfully
- [ ] Files loading correctly (check Network tab in DevTools)
- [ ] Frontend URL copied

### Final Testing
- [ ] Visit frontend URL in browser
- [ ] Try signup → check Network tab for POST to `/api/auth/register`
- [ ] Check backend logs in Render
- [ ] Verify token is returned (200/201 response)
- [ ] Verify user data saved to MongoDB

---

## Useful Commands for Testing

### Check if backend is running
```bash
curl https://your-backend.onrender.com/health
```

### Test signup API
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123456"}'
```

### Generate new JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## After Deployment

### Production Improvements
1. **Restrict CORS** in backend/server.js (line 46)
   - Currently allows all origins
   - Change to only allow your frontend URL

2. **Use HTTPS everywhere**
   - Render provides free HTTPS
   - Ensure all API calls use https://

3. **Set up monitoring**
   - Render has built-in logs and alerts
   - Monitor for errors in production

4. **Database backups**
   - Enable backups in MongoDB Atlas
   - Monitor database size and usage

---

## Support Links
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Node.js on Render: https://render.com/docs/deploy-node-express

