# Quick Deployment Guide

## ✅ Pre-Deployment Status
- Code committed and pushed to GitHub
- Frontend builds successfully
- Backend APIs all working
- 20 stocks in database ready

---

## 🚀 Deploy Frontend to Firebase

### One-Click Deploy
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

**Takes**: ~2-3 minutes
**Result**: App live at `https://datamind-71f46.web.app`

### Manual Steps
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select project `datamind-71f46`
3. Go to Hosting
4. Click Deploy new version
5. Upload `frontend/dist` folder
6. Wait for deployment to complete

---

## 🚀 Deploy Backend to Railway

### Option 1: Railway Dashboard (Easiest)
1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. Select your InsightHub project
4. Click "Deploy"
5. Monitor the deployment in real-time

### Option 2: Railway CLI
```bash
npm install -g railway
railway login
railway link  # Link to your Railway project
railway up    # Deploy
```

**Takes**: ~5-10 minutes
**Result**: Backend live with Railway URL

### Option 3: GitHub Auto-Deploy
1. In Railway dashboard, connect GitHub repo
2. Each push to `main` triggers auto-deployment
3. Check Railway dashboard for deployment status

---

## ✅ Post-Deployment Verification

### Test Frontend
```
Visit: https://datamind-71f46.web.app
1. Search for "RELIANCE"
2. Click on a stock
3. Check if chart loads
4. Verify ₹ currency symbol
```

### Test Backend
```bash
# Replace YOUR_RAILWAY_URL with actual backend URL
curl https://YOUR_RAILWAY_URL/api/v1/financial/stock/search?q=RELIANCE

# Expected response:
{
  "data": [
    {
      "symbol": "RELIANCE",
      "name": "Reliance Industries Ltd",
      "price": 2845.50,
      ...
    }
  ]
}
```

### Update Frontend API URL
If Railway URL is different, update:
- `frontend/src/pages/Stocks.tsx` line 17
- `frontend/src/pages/StockDetail.tsx` line 54
- Change `http://localhost:8000` to `https://YOUR_RAILWAY_URL`

Then redeploy frontend.

---

## 📊 Current Database

**Indian Stocks (NSE - ₹)**
- RELIANCE, TCS, INFY, HDFC, WIPRO, BAJAJ, SBIN, HDFCBANK, LT, ICICIBANK, MARUTI, HUL

**Global Stocks (NASDAQ - $)**
- AAPL, GOOGL, MSFT, AMZN, META, NVDA, TSLA, NFLX

---

## 🔧 Troubleshooting

### Frontend shows "API Error"
- Check backend is running
- Verify API URL is correct in code
- Check CORS settings in backend

### Charts don't load
- Clear browser cache
- Check console for errors
- Verify Recharts data format

### Watchlist doesn't persist
- Check browser localStorage is enabled
- Look for errors in browser console

### Stocks not found
- Verify database has been seeded
- Check backend logs for database errors

---

## 📱 Access Points

**Frontend (After Deploy)**
- Firebase: `https://datamind-71f46.web.app`
- Local: `http://localhost:5173`

**Backend (After Deploy)**
- Railway: `https://YOUR_RAILWAY_URL`
- Local: `http://localhost:8000`

**Health Check**
- Backend: `https://YOUR_RAILWAY_URL/health`
- Should return: `{"status": "ok"}`

---

## 📞 Support

If deployment fails:
1. Check the specific service's dashboard (Firebase/Railway)
2. Look at the error logs
3. Verify all environment variables are set
4. Ensure GitHub commit is pushed

---

**Last Updated**: 2026-07-14
**Status**: ✅ Ready for Deployment
