# Fix CORS Issue on Railway — ACTION REQUIRED ⚠️

## Problem
Frontend (Firebase) is getting CORS errors when trying to connect to backend (Railway).

```
Access to XMLHttpRequest has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header
```

## Root Cause
Railway is running the backend WITHOUT the CORS configuration because **environment variables are not set in Railway's dashboard**.

### Why .env doesn't work on Railway
- `.env` files are **git-ignored** (correct for security) ✅
- Railway doesn't read local `.env` files automatically
- Environment variables must be set explicitly in **Railway Dashboard**

## Solution: Set Environment Variables in Railway Dashboard

### Step 1: Go to Railway Dashboard
1. Visit: https://railway.app/dashboard
2. Select your project: **InsightHub**
3. Select your backend service

### Step 2: Set Environment Variables
In the **Variables** section, add these variables:

```
ENVIRONMENT=production
DEBUG=False

CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:5174","http://localhost:5175","https://datamind-71f46.web.app"]
CORS_ALLOW_CREDENTIALS=True
```

Or if Railway doesn't accept JSON format, try comma-separated:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175,https://datamind-71f46.web.app
```

### Step 3: Verify Other Required Variables
Make sure these are also set (they should already be):

```
DATABASE_URL=postgresql+asyncpg://...
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1
OPEN_METEO_ARCHIVE_URL=https://archive-api.open-meteo.com/v1
OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1
OPEN_METEO_AQI_URL=https://air-quality-api.open-meteo.com/v1
```

### Step 4: Redeploy
- Click **Deploy** or trigger a new deployment
- Wait for deployment to complete (watch logs)

### Step 5: Test
Once deployed, the CORS error should disappear and the app should load weather data.

---

## What We Changed in Code

✅ **Added Firebase domain to default CORS origins** in `backend/app/core/config.py`

```python
CORS_ORIGINS: List[str] = Field(
    default=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "https://datamind-71f46.web.app"],
    description="Allowed CORS origins"
)
```

This means:
- If Railway env variables are not set, it will fall back to these defaults
- **Firebase domain is now included by default** ✅
- Code change has been pushed to GitHub and Railway is auto-deploying

---

## Timeline
1. ✅ Code fixed and pushed to GitHub
2. 🔄 Railway auto-deploying (check logs in dashboard)
3. ⏳ **YOU**: Set env variables in Railway dashboard (if needed)
4. ⏳ **YOU**: Trigger redeploy if env vars were missing
5. ✅ Test app at https://datamind-71f46.web.app

---

## If Still Getting CORS Errors

### Check 1: Backend is running
```bash
curl https://insighthub-production.up.railway.app/health
# Should return: {"status":"healthy",...}
```

### Check 2: Check Railway Logs
1. Go to Railway dashboard
2. Select backend service
3. Click **Logs** tab
4. Look for CORS-related messages

### Check 3: Verify CORS in code
The backend should print CORS origins on startup:
```
CORS enabled for origins: http://localhost:3000, http://localhost:5173, ...
```

---

## Security Note ✅
- ✅ `.env` file is git-ignored (secrets safe)
- ✅ No API keys exposed in code
- ✅ Database credentials not in repository
- ✅ Environment variables set securely in Railway dashboard only

---

**Status:** Code ready, waiting for Railway environment variables to be configured.

