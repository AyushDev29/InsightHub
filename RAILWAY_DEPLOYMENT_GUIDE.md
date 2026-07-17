# How to Deploy Latest Code to Railway

## Current Situation

### Latest Code Commits
```
a3403fd (HEAD) - fix: add default values for missing weather data + handle null forecast_time in dashboard
b2344a6 - fix: set production environment as default
99eccdb - fix: add Firebase domain to default CORS origins for production
f60b6c0 - refactor: implement country-first, module-agnostic database architecture
```

### Current Branch
- **Working Branch:** `feature/phase-d-geo-intelligence`
- **Latest Commit:** `a3403fd`
- **Status:** Pushed to GitHub ✅

### Railway Configuration
- **Dockerfile:** `backend/Dockerfile`
- **Builder:** `DOCKERFILE`
- **Health Check:** `/health` endpoint

---

## The Problem

Railway is running OLD code that doesn't return humidity/pressure/visibility.

**Latest code (a3403fd) DOES return these values** because it:
1. Requests them from Open-Meteo API
2. Provides defaults if missing

But Railway hasn't picked up the new code yet.

---

## How to Deploy Latest Code to Railway

### Option 1: Via Railway Dashboard (EASIEST) 🎯

1. **Go to Railway Dashboard**
   - URL: https://railway.app/dashboard
   - Login with your account

2. **Select Your Project**
   - Click: `insighthub-production` or `insighthub-production-4b27`

3. **Select Backend Service**
   - In the left panel, click the backend service (Python/FastAPI)

4. **Redeploy Latest**
   - Look for one of these buttons:
     - **"Redeploy Latest"** - Click this!
     - **"Deploy"** - If you see this
     - **Or** go to Settings → Click "Redeploy Latest"

5. **Wait 2-3 Minutes**
   - Railway will pull latest code from GitHub
   - Build Docker image
   - Restart the service

6. **Verify**
   - Test API: `https://insighthub-production.up.railway.app/api/v1/weather/current?latitude=28.6139&longitude=77.2090`
   - Should see: `humidity: 80`, `pressure: 972.5`, `visibility: 11160`

---

### Option 2: Via GitHub Push (What We Did)

If Railway is set to auto-deploy on GitHub changes:

1. **Latest code is already pushed** ✅
   ```
   git push origin feature/phase-d-geo-intelligence
   ```

2. **Railway watches this branch** and auto-deploys

3. **But auto-deploy might be slow** or not configured

**Solution:** Manually trigger redeploy (Option 1)

---

### Option 3: Via Railway CLI (Advanced)

If you have Railway CLI installed:

```bash
railway login
railway link
railway deploy --detach
```

But **Option 1 is easier** - just use the dashboard.

---

## What Each Commit Does

| Commit | What It Fixes |
|--------|---------------|
| `a3403fd` | ✅ Handles null `forecast_time` in dashboard charts, adds type safety checks |
| `b2344a6` | ✅ Sets production environment, improves CORS defaults |
| `99eccdb` | ✅ **Adds Firebase domain to CORS** - this is critical! |

---

## After Deployment, You Should See:

✅ **Localhost (already working):**
- humidity: 80
- pressure: 972.5
- visibility: 11160

✅ **Railway (will work after redeploy):**
- humidity: 80
- pressure: 972.5
- visibility: 11160

✅ **Firebase Frontend:**
- All pages load
- No errors
- Humidity/pressure/visibility display properly

---

## Step-by-Step Screenshots

### Step 1: Go to Railway Dashboard
- URL: https://railway.app/dashboard

### Step 2: Select Project
- Click on `insighthub-production`

### Step 3: Select Backend Service
- Click on the backend service in the sidebar

### Step 4: Find Redeploy Button
- Look at the top or in the "Deploy" section
- Click "Redeploy Latest"

### Step 5: Wait & Verify
- Backend will restart
- Test the API endpoint

---

## Quick Test After Deployment

```bash
# Local backend (already working)
curl http://localhost:8000/api/v1/weather/current?latitude=28.6139&longitude=77.2090

# Railway backend (test after redeploy)
curl https://insighthub-production.up.railway.app/api/v1/weather/current?latitude=28.6139&longitude=77.2090
```

Both should return:
```json
{
  "humidity": 80,
  "pressure": 972.5,
  "visibility": 11160
}
```

---

## Summary

1. **Go to Railway Dashboard** → https://railway.app/dashboard
2. **Select project** → insighthub-production
3. **Select backend service**
4. **Click "Redeploy Latest"**
5. **Wait 2-3 minutes**
6. **Test API** - should now return humidity/pressure/visibility!

That's it! 🎉

