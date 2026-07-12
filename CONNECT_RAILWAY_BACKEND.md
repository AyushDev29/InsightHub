# 🚀 Connect Frontend to Railway Backend

Your frontend is deployed on Firebase but needs to connect to your backend on Railway.

## Step 1: Get Your Railway Backend URL

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Find your backend service
4. Look for **"Public Network"** or **"Railway Domain"**
5. It should look like: `https://your-project-name.up.railway.app`

**Example:** `https://insighthub-production-up.railway.app`

---

## Step 2: Update Frontend Environment

Once you have your Railway URL, update this file:

**File:** `frontend/.env.production`

```env
VITE_API_BASE_URL=https://YOUR-RAILWAY-URL-HERE
VITE_API_V1_PREFIX=/api/v1
```

**Replace `YOUR-RAILWAY-URL-HERE` with your actual Railway domain**

---

## Step 3: Rebuild & Redeploy Frontend

```bash
cd frontend
npm run build
cd ..
firebase deploy --token "YOUR-FIREBASE-TOKEN"
```

---

## Step 4: Verify Backend CORS

Your backend CORS has been updated to allow:
- ✅ `https://datamind-71f46.web.app` (Firebase)
- ✅ `http://localhost:*` (local development)

**Backend .env updated:**
```
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","https://datamind-71f46.web.app"]
```

---

## Step 5: Deploy Backend Changes

If you updated the backend .env, you need to:

1. Push changes to your Railway Git repository
2. Railway will auto-deploy
3. Or manually trigger a deploy in Railway dashboard

---

## Testing Connection

After deploying, visit: **https://datamind-71f46.web.app**

Open browser console (F12 → Console) and check:
- ❌ CORS errors = backend URL wrong
- ❌ 404 errors = backend not running
- ✅ Data loading = Everything working!

---

## Troubleshooting

### "Failed to load data. Is the backend running?"

**Cause:** Backend URL is wrong or backend is down

**Fix:**
1. Verify Railway backend URL is correct
2. Test backend directly: visit `https://your-backend-url/health`
3. Should return JSON: `{"status":"healthy"}`

### CORS Error in Console

**Cause:** Firebase domain not in backend CORS

**Fix:**
```python
# In backend/.env:
CORS_ORIGINS=["https://datamind-71f46.web.app"]
```

Then redeploy backend on Railway.

### 504 Gateway Timeout

**Cause:** Railway backend is sleeping or not responding

**Fix:**
1. Check Railway dashboard - backend status
2. Restart the service if needed
3. Check database connection

---

## Quick Checklist

- [ ] Got Railway backend URL
- [ ] Updated `frontend/.env.production` with backend URL
- [ ] Rebuilt frontend: `npm run build`
- [ ] Redeployed to Firebase: `firebase deploy`
- [ ] Backend CORS includes Firebase domain
- [ ] Backend is running on Railway
- [ ] Tested `/health` endpoint from backend

---

**Once complete:** Your Firebase frontend will connect to Railway backend ✅

Need help? Check the console errors first (F12 → Network tab → see API calls)
