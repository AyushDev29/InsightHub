# Backend Deployment Guide - Fix for Other Devices Issue

## The Problem

❌ **Current Status:**
- ✅ Frontend deployed to Firebase (`https://datamind-71f46.web.app`)
- ❌ Backend running only on localhost (`http://localhost:8000`)
- ❌ Other devices fail because they try to hit their own `localhost:8000`

**Result:** Works on your laptop, fails on all other devices (phone, tablet, friend's PC, etc.)

## The Solution

Deploy the backend to **Railway** so it gets a public URL accessible from anywhere.

---

## Step-by-Step Deployment Instructions

### Prerequisites

You need:
1. Railway account (https://railway.app)
2. Your GitHub repo (already connected)
3. Backend code in main branch (✅ just pushed)

### Method 1: Railway Dashboard (EASIEST) ✅

#### Step 1: Go to Railway Dashboard
1. Open https://railway.app/dashboard
2. Login with your account

#### Step 2: Find Your Project
1. Look for your project (e.g., "insighthub" or "InsightHub-AI")
2. Click on it

#### Step 3: Select Backend Service
1. In the left panel, you'll see services
2. Click the **backend service** (should be labeled "python" or "FastAPI" or have a gear icon)

#### Step 4: Click "Redeploy Latest"
1. Look at the top of the page
2. Find the button that says **"Redeploy Latest"** or **"Deploy"**
3. Click it

**Screenshot hint:** It's usually near the service name at the top right

#### Step 5: Wait for Deployment
- Railway will:
  1. Pull latest code from GitHub ✅
  2. Build Docker image
  3. Start the backend service
  4. Assign a public URL
- This takes **2-3 minutes**

#### Step 6: Get Your Backend URL
1. After deployment completes, look for the "Public URL" or "Environment"
2. It should look like: `https://insighthub-production.up.railway.app` or similar
3. **Copy this URL** - you'll need it

#### Step 7: Update Frontend to Use Railway Backend

**In your code (`Stocks.tsx` and `StockDetail.tsx`):**

Change this line:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
```

To use your Railway URL. You can set an environment variable in Firebase:

1. Create `.env.production` in frontend folder:
```
VITE_API_URL=https://insighthub-production.up.railway.app/api/v1
```

2. Or hardcode in the file (temporary):
```typescript
const API_URL = 'https://insighthub-production.up.railway.app/api/v1' // or your Railway URL
```

3. Rebuild and redeploy frontend:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

### Method 2: Railway CLI (Advanced)

If you have Railway CLI installed:

```bash
# Login
railway login

# Connect to your project
railway link

# Deploy
railway deploy --detach
```

---

### Method 3: Via GitHub Auto-Deploy (If Enabled)

If Railway is set to auto-deploy:
1. Code is already pushed ✅
2. Railway will automatically pull and deploy
3. Wait 5-10 minutes

**Check deployment status:**
- Go to your Railway dashboard
- Look at the deployment logs to see if it's building

---

## After Deployment - Testing

### Test Backend is Running

Open this URL in your browser (replace with your Railway URL):
```
https://insighthub-production.up.railway.app/health
```

Should return:
```json
{"status": "ok"}
```

### Test Stock API

```
https://insighthub-production.up.railway.app/api/v1/financial/stock/search?q=RELIANCE&limit=1
```

Should return stock data with price, change, etc.

---

## Finding Your Backend URL

If you can't find your backend URL:

1. Go to Railway Dashboard
2. Click your project
3. Click the backend service
4. Look for:
   - **"Public URL"** section
   - **"Domains"** tab
   - **"Settings"** and look for "Public URL"

It will look like one of these:
- `https://insighthub-production.up.railway.app`
- `https://your-project-name.up.railway.app`

---

## Common Issues

### Issue: "Redeploy Latest" button not showing

**Solution:**
1. Go to Service Settings
2. Look for "Source" or "GitHub"
3. Make sure it's connected to your repo
4. Click "Redeploy Latest" or "Deploy"

### Issue: Deployment fails

**Possible causes:**
1. Database connection issue - check `.env` DATABASE_URL
2. Missing environment variables - check `.env` file has all required keys
3. Port not 8000 - make sure PORT=8000 in `.env`

**Fix:**
1. Check Railway deployment logs for error message
2. Verify `.env` variables are set in Railway dashboard
3. Look for red error text in the logs

### Issue: API returns 502 Bad Gateway

**Meaning:** Backend crashed

**Fix:**
1. Go to Railway dashboard
2. Check the logs for errors
3. Look for Python exception messages
4. If database connection fails, verify DATABASE_URL is correct

---

## Update Frontend After Backend Deployment

### Quick Method (Hardcode URL)

**File:** `frontend/src/pages/Stocks.tsx`

Find this line:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
```

Change to:
```typescript
const API_URL = 'https://insighthub-production.up.railway.app/api/v1' // Replace with your URL
```

Same for `frontend/src/pages/StockDetail.tsx`

Then rebuild and deploy:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Proper Method (Environment Variable)

Create `frontend/.env.production`:
```
VITE_API_URL=https://insighthub-production.up.railway.app/api/v1
```

Then rebuild:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

---

## After Everything is Deployed

### What should work now:

✅ Open `https://datamind-71f46.web.app` on your laptop
✅ Open on your phone - should load and work!
✅ Open on a friend's device - should load and work!
✅ Stock prices update from Railway backend
✅ Auto-refresh works globally
✅ Charts load on any device

### Test From Different Devices

1. Get the URL: `https://datamind-71f46.web.app`
2. Open on phone (same WiFi or 4G)
3. Open on tablet
4. Open on friend's laptop
5. All should show stock data with real prices

---

## Summary Checklist

- [ ] Go to Railway Dashboard
- [ ] Find your backend service
- [ ] Click "Redeploy Latest"
- [ ] Wait 2-3 minutes for deployment
- [ ] Get your backend URL
- [ ] Copy backend URL
- [ ] Update frontend API_URL
- [ ] Rebuild frontend: `npm run build`
- [ ] Deploy frontend: `firebase deploy --only hosting`
- [ ] Test from different device
- [ ] ✅ All devices should work!

---

## Quick Command Reference

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Deploy frontend
firebase deploy --only hosting

# Check backend health
curl https://your-railway-url/health

# Test stock API
curl https://your-railway-url/api/v1/financial/stock/search?q=RELIANCE

# View logs locally
python -m backend.app.main  # runs on localhost:8000
```

---

## If You're Stuck

The most common issue is that the **frontend still points to localhost**.

**Quick fix:**
1. Open `frontend/src/pages/Stocks.tsx`
2. Find: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`
3. Change to: `const API_URL = 'https://YOUR-RAILWAY-URL/api/v1'`
4. Run: `cd frontend && npm run build && firebase deploy --only hosting`

That's it!

---

## Additional Resources

- Railway Dashboard: https://railway.app/dashboard
- Firebase Hosting: https://console.firebase.google.com
- Your GitHub Repo: https://github.com/AyushDev29/InsightHub
- Backend Dockerfile: `/backend/Dockerfile`
- Railway Config: `/railway.toml`
