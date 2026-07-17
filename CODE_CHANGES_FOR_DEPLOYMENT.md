# Exact Code Changes Needed

## Problem
Frontend on Firebase points to `localhost:8000` which doesn't work on other devices.

## Solution
After deploying backend to Railway, update API URL in frontend.

---

## File 1: `frontend/src/pages/Stocks.tsx`

### Find (Line ~22):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
```

### Change to:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://insighthub-production.up.railway.app/api/v1'
```

**Note:** Replace `insighthub-production.up.railway.app` with YOUR Railway URL

---

## File 2: `frontend/src/pages/StockDetail.tsx`

### Find (Line ~58):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
```

### Change to:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://insighthub-production.up.railway.app/api/v1'
```

**Note:** Same Railway URL as above

---

## How to Get Your Railway URL

1. Go to https://railway.app/dashboard
2. Click your project
3. Click the backend service
4. Look for "Public URL" - it looks like:
   - `https://insighthub-production.up.railway.app`
   - `https://your-custom-domain.up.railway.app`
   - Or a Railway-generated name

**That's your API URL base** (the part before `/api/v1`)

---

## After Making Changes

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy to Firebase
```bash
firebase deploy --only hosting
```

### Wait
- 2-3 minutes for Firebase to deploy

### Test
- Open on other device
- Should see stocks loading
- No errors!

---

## What Each File Does

### Stocks.tsx
- Stock listing page with market movers
- Uses API for: gainers, losers, trending, search
- Called when user opens `/finance/stocks`

### StockDetail.tsx
- Individual stock page with charts
- Uses API for: stock quote, OHLCV data, technicals, fundamentals
- Called when user clicks on a stock

---

## Example Railway URLs

Common formats:

```
https://insighthub-production.up.railway.app
https://insighthub-api.up.railway.app
https://insighthub.up.railway.app
https://your-project-name.up.railway.app
https://c0d1ng-ai.up.railway.app
```

**Go to Railway dashboard to find YOURS**

---

## Testing After Update

### Test on Laptop
```bash
# In browser
https://datamind-71f46.web.app/finance/stocks

# Should see:
- Stock list loading
- Prices updating
- No errors in console
```

### Test on Phone (Same WiFi)
```bash
# In phone browser
https://datamind-71f46.web.app/finance/stocks

# Should see:
- Stock list loading
- Prices updating
- No errors
```

### Test on Phone (4G Network)
```bash
# Same as above, should work because backend is on Railway
```

---

## Troubleshooting

### Error: "Failed to load statistics"
→ API URL wrong in code
→ Railway backend not deployed
→ Check both files have Railway URL

### Error: "TypeError: Failed to fetch"
→ Same as above
→ Check network tab in browser DevTools

### Works locally but not on phone
→ Still using localhost
→ Make sure you changed BOTH files
→ Rebuild: `npm run build`
→ Redeploy: `firebase deploy --only hosting`

### 502 Bad Gateway
→ Backend crashed on Railway
→ Go to Railway dashboard
→ Check logs for error
→ Restart the service

---

## Quick Checklist

- [ ] Deploy backend to Railway
- [ ] Get Railway URL (copy from dashboard)
- [ ] Open `frontend/src/pages/Stocks.tsx`
- [ ] Change API_URL line (replace localhost with Railway URL)
- [ ] Open `frontend/src/pages/StockDetail.tsx`
- [ ] Change API_URL line (same Railway URL)
- [ ] Run: `cd frontend && npm run build`
- [ ] Run: `firebase deploy --only hosting`
- [ ] Wait 2-3 minutes
- [ ] Test on other device
- [ ] ✅ Should work!

---

## Multiple Environment Setup (Advanced)

If you want different URLs for dev/prod:

### Create `frontend/.env.production`
```
VITE_API_URL=https://insighthub-production.up.railway.app/api/v1
```

### Create `frontend/.env.development`
```
VITE_API_URL=http://localhost:8000/api/v1
```

Then code uses: `import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`

- Dev: Uses localhost
- Prod: Uses Railway URL

**But simple change above works fine too.**

---

## One More Thing

After deploying, you might want to disable auto-refresh on localhost for testing:

### In Stocks.tsx, find:
```typescript
useEffect(() => {
  const checkAndRefresh = async () => {
    // ... code ...
  }
  checkAndRefresh()
  const interval = setInterval(checkAndRefresh, 60000)
  return () => clearInterval(interval)
}, [])
```

This is working correctly - no changes needed. It'll auto-refresh when market is open.

---

## Summary

1. Deploy backend to Railway ✅
2. Get Railway URL ✅
3. Change 2 files (Stocks.tsx, StockDetail.tsx) ✅
4. Rebuild frontend ✅
5. Deploy frontend ✅
6. Test on other device ✅

Done!
