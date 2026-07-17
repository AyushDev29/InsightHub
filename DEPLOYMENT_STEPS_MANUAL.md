# Manual Deployment Steps - Frontend & Backend

## Current Status
✅ Code committed and pushed to GitHub
✅ Frontend built in `frontend/dist/`
✅ Backend ready in `backend/`
✅ All APIs tested locally and working

---

## 🚀 FRONTEND DEPLOYMENT (Firebase)

### Step 1: Authenticate with Firebase

Since interactive login is needed, you need to do this manually:

```bash
# Open PowerShell/Terminal in the project root and run:
firebase login

# This will:
# 1. Open a browser window
# 2. Ask you to sign in with: officialayush292006@gmail.com
# 3. Return a token to the terminal
```

**Make sure you approve the permission when prompted in the browser.**

### Step 2: Deploy Frontend

```bash
# Run from project root (c:\projects\data analust project\InsightHub-AI)
firebase deploy --only hosting

# Expected output:
# ✔  hosting[datamind-71f46]: file uploading complete
# ✔  hosting[datamind-71f46]: version finalized
# ✔  hosting[datamind-71f46]: released and live!
# Visit your site at: https://datamind-71f46.web.app
```

### Step 3: Verify Firebase Deployment

```bash
# Check your live app:
firebase open hosting

# Or visit directly:
# https://datamind-71f46.web.app
```

**✅ Frontend deployed when you see: "released and live!"**

---

## 🚀 BACKEND DEPLOYMENT (Railway)

### Option A: Via Railway Dashboard (RECOMMENDED - Easiest)

1. **Open Railway Dashboard**
   - Go to: https://railway.app/dashboard
   - Sign in (use GitHub or email)

2. **Select Your Project**
   - Look for: `insighthub-production` or `InsightHub`
   - Click on it

3. **Select Backend Service**
   - In the services list on the left
   - Click on the Python/FastAPI backend service

4. **Deploy Latest Code**
   - Look for a button that says:
     - **"Redeploy Latest"** ← Click this
     - Or **"Deploy"**
   - Click it to pull and deploy the latest code from GitHub

5. **Wait 5-10 minutes**
   - Railway will:
     - Clone latest code from GitHub
     - Build Docker image
     - Deploy new version
   - You'll see status updates in the dashboard

6. **Get Your Backend URL**
   - In Railway dashboard, look for "Domains" section
   - You'll see something like: `https://insighthub-production.up.railway.app`
   - Copy this URL

### Option B: Via Railway CLI (If you want to install it)

```bash
# Install Railway CLI
npm install -g railway

# Login to Railway
railway login

# Navigate to project
cd "c:\projects\data analust project\InsightHub-AI"

# Link to your Railway project
railway link

# Deploy
railway up --detach
```

### Option C: Via GitHub (Auto-Deploy)

If your Railway project is connected to GitHub:
- Latest code is already pushed ✅
- Railway might auto-deploy (check dashboard for progress)
- If not auto-deploying, manually redeploy via dashboard

---

## ⚙️ POST-DEPLOYMENT: Update Frontend API URL

After backend is deployed, you need to update the frontend to use the backend URL.

### Step 1: Get Backend URL from Railway

In Railway dashboard:
- Select your project
- Select backend service
- Look for "Domains" or "URL" section
- Copy the URL (e.g., `https://insighthub-production.up.railway.app`)

### Step 2: Update Frontend Code

**File: `frontend/src/pages/Stocks.tsx`**
- Line 17: Change `http://localhost:8000` to your Railway backend URL

**File: `frontend/src/pages/StockDetail.tsx`**
- Line 54: Change `http://localhost:8000` to your Railway backend URL

**Example:**
```typescript
// Before:
const API_URL = 'http://localhost:8000/api/v1'

// After:
const API_URL = 'https://insighthub-production.up.railway.app/api/v1'
```

### Step 3: Rebuild and Redeploy Frontend

```bash
cd frontend
npm run build

firebase deploy --only hosting

# Wait for: "released and live!"
```

---

## ✅ VERIFICATION CHECKLIST

### Frontend (Firebase)
- [ ] `firebase deploy` completed successfully
- [ ] Visit: `https://datamind-71f46.web.app`
- [ ] App loads without errors
- [ ] Can search for stocks

### Backend (Railway)
- [ ] Backend deployed on Railway
- [ ] You have the backend URL (e.g., `https://insighthub-production.up.railway.app`)
- [ ] Test API: `https://YOUR_BACKEND_URL/api/v1/financial/stock/search?q=RELIANCE`
- [ ] Should return JSON with stock data

### Integration
- [ ] Frontend API URL updated to Railway backend
- [ ] Frontend rebuilt and redeployed
- [ ] Frontend can fetch data from Railway backend
- [ ] Stock page loads with real data
- [ ] Stock detail page shows charts

---

## 🔗 Final Live URLs

**After successful deployment, you'll have:**

```
Frontend:  https://datamind-71f46.web.app
Backend:   https://insighthub-production.up.railway.app
```

**Test the complete system:**
1. Open frontend URL
2. Search for "RELIANCE"
3. Click on it
4. Charts should load
5. ₹ symbol should display

---

## 🆘 TROUBLESHOOTING

### Firebase Login Issue
```
Error: Failed to authenticate

Solution: Run: firebase login
This opens a browser to authenticate with officialayush292006@gmail.com
```

### Firebase Deployment Hangs
```
Solution: 
1. Ctrl+C to cancel
2. Run: firebase deploy --only hosting --debug
3. Check for errors in output
```

### Backend Not Found (404 error in frontend)
```
Solution:
1. Verify Railway deployment is complete
2. Verify backend URL is correct in frontend code
3. Rebuild frontend: cd frontend && npm run build
4. Redeploy: firebase deploy --only hosting
```

### API Returns CORS Error
```
Solution: Backend should have CORS enabled for Firebase domain
Already configured in: backend/app/core/config.py
No action needed if you deployed from this code.
```

---

## 📝 COMMANDS SUMMARY

```bash
# Firebase Login (only once)
firebase login

# Firebase Deploy Frontend
cd c:\projects\data\ analyst\ project\InsightHub-AI
firebase deploy --only hosting

# Update Frontend API URL
# Edit frontend/src/pages/Stocks.tsx
# Edit frontend/src/pages/StockDetail.tsx

# Rebuild Frontend
cd frontend
npm run build

# Redeploy Frontend after URL update
firebase deploy --only hosting

# Test Backend
curl https://YOUR_BACKEND_URL/api/v1/financial/stock/search?q=RELIANCE

# Test Frontend
Visit: https://datamind-71f46.web.app
```

---

## 📊 What Gets Deployed

### Firebase (Frontend)
- All React components
- TypeScript compiled to JavaScript
- Tailwind CSS
- Chart libraries (Recharts)
- Icons (Lucide)
- Total size: ~1.2 MB (gzipped)

### Railway (Backend)
- Python FastAPI application
- PostgreSQL database connection
- Financial APIs integration
- All 6 endpoints:
  - Stock search
  - Market movers
  - Trending stocks
  - Technical indicators
  - Fundamentals
  - OHLCV chart data

---

## ✨ YOU'RE READY!

Just follow the steps above and you'll have:
- ✅ Live frontend on Firebase
- ✅ Live backend on Railway
- ✅ Stock Intelligence Platform available to the world
- ✅ Professional financial analytics platform

**Total time needed: ~15-20 minutes**

---

**Generated:** 2026-07-14
**Status:** Ready for Manual Deployment
