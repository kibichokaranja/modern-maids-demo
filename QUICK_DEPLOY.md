# Quick Deployment Checklist

## Before You Start
- [ ] Push your code to GitHub (if not already done)
- [ ] Have your GitHub account ready

## Deploy Backend (Railway) - 5 minutes

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your **ModernMaids** repository
4. In project settings, set **Root Directory** to: `server`
5. Add Environment Variables:
   - `JWT_SECRET`: Any random string (e.g., `modern-maids-secret-2024`)
   - `CLIENT_URL`: Leave empty for now
6. Wait for deployment (2-3 minutes)
7. **Copy your backend URL** (e.g., `https://modern-maids-backend.railway.app`)

## Deploy Frontend (Vercel) - 5 minutes

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your **ModernMaids** repository
4. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js (auto-detected)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Paste your Railway backend URL
6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. **Copy your frontend URL** (e.g., `https://modern-maids.vercel.app`)

## Update Backend CORS - 2 minutes

1. Go back to Railway dashboard
2. Click on your backend service
3. Go to **Variables** tab
4. Update `CLIENT_URL` to your Vercel frontend URL
5. Service will auto-redeploy

## Test Your Deployment

1. Open your Vercel URL in browser
2. Try logging in:
   - Admin: `admin@modernmaids.com` / `admin123`
   - Cleaner: `cleaner@modernmaids.com` / `cleaner123`
3. If login works, you're done! 🎉

## Share in Outreach Email

**Subject:** Modern Maids Demo Portal

Hi [Name],

I've prepared a demo of our cleaning management system for Modern Maids. You can access it here:

**[Your Vercel URL]**

**Demo Credentials:**
- Admin: `admin@modernmaids.com` / `admin123`
- Cleaner: `cleaner@modernmaids.com` / `cleaner123`

The demo includes:
- Cleaner login and dashboard
- Job scheduling and management
- Check-in/check-out functionality
- Performance metrics
- Timesheets and activity logs
- Real-time updates

Let me know if you'd like to schedule a call to discuss how this can be customized for Modern Maids.

Best regards,
[Your Name]

---

## Troubleshooting

**CORS Error?**
- Make sure `CLIENT_URL` in Railway matches your Vercel URL exactly
- Include `https://` in the URL
- Redeploy backend after updating

**Can't Connect to Backend?**
- Check Railway logs for errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Test backend URL directly: `https://your-backend-url.railway.app/api/health`

**Build Fails?**
- Check deployment logs
- Verify all files are committed to GitHub
- Make sure `package.json` files are correct

