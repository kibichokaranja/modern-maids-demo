# Modern Maids - Deployment Guide

This guide will help you deploy the Modern Maids demo to production so you can share a link in your outreach email.

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your ModernMaids repository
   - Choose the `server` folder as the root directory

3. **Configure Backend**
   - Railway will auto-detect Node.js
   - Add Environment Variables:
     - `PORT`: Leave as default (Railway sets this automatically)
     - `JWT_SECRET`: Generate a random string (e.g., use a password generator)
     - `CLIENT_URL`: Leave empty for now (we'll update after frontend deploys)
   - Click "Deploy"

4. **Get Backend URL**
   - Once deployed, Railway will provide a URL like: `https://modern-maids-backend.railway.app`
   - Copy this URL - you'll need it for the frontend

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your ModernMaids repository
   - Set Root Directory to: `client`
   - Framework Preset: Next.js (auto-detected)

3. **Configure Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL` = Your Railway backend URL (e.g., `https://modern-maids-backend.railway.app`)
   - Click "Deploy"

4. **Get Frontend URL**
   - Vercel will provide a URL like: `https://modern-maids.vercel.app`
   - This is your demo link!

#### Step 3: Update Backend CORS

1. **Go back to Railway**
   - Edit your backend service
   - Update `CLIENT_URL` environment variable to your Vercel URL
   - Example: `https://modern-maids.vercel.app`
   - Redeploy the backend

### Option 2: Render (Full-Stack)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Name: `modern-maids-backend`
     - Root Directory: `server`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node index.js`
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render uses this)
     - `JWT_SECRET`: Generate random string
     - `CLIENT_URL`: Leave empty for now
   - Click "Create Web Service"
   - Copy the backend URL (e.g., `https://modern-maids-backend.onrender.com`)

3. **Deploy Frontend**
   - Click "New" → "Static Site"
   - Connect your GitHub repo
   - Settings:
     - Name: `modern-maids-frontend`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Publish Directory: `.next`
   - Add Environment Variable:
     - `NEXT_PUBLIC_API_URL`: Your backend URL
   - Click "Create Static Site"
   - Copy the frontend URL

4. **Update Backend CORS**
   - Go back to backend service
   - Update `CLIENT_URL` to your frontend URL
   - Redeploy

## Environment Variables Summary

### Backend (Railway/Render)
- `PORT`: Auto-set by platform
- `JWT_SECRET`: Random secure string
- `CLIENT_URL`: Your frontend URL (e.g., `https://modern-maids.vercel.app`)

### Frontend (Vercel/Render)
- `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://modern-maids-backend.railway.app`)

## Demo Credentials

Share these credentials in your outreach email:

**Admin Login:**
- Email: `admin@modernmaids.com`
- Password: `admin123`

**Cleaner Login:**
- Email: `cleaner@modernmaids.com`
- Password: `cleaner123`

## Troubleshooting

### CORS Errors
- Make sure `CLIENT_URL` in backend matches your frontend URL exactly
- Include `https://` in the URL
- Redeploy backend after updating CORS

### API Connection Errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend
- Check backend is running and accessible
- Test backend URL directly in browser (should see JSON error or health check)

### Build Errors
- Make sure all dependencies are in `package.json`
- Check Node.js version (should be 18+)
- Review build logs in deployment platform

## Quick Start Commands

### Local Development
```powershell
cd ModernMaids
.\start.ps1
```

### Check Deployment Status
- Railway: Check service logs in dashboard
- Vercel: Check deployment logs in dashboard

## Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables are set correctly
3. Ensure both services are running
4. Test backend URL directly in browser

