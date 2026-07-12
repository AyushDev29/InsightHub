# ✅ Deployment Checklist - Backend to Railway

## Before You Deploy

### 1. Local Testing (5 mins)

```bash
# Open terminal in backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python -m uvicorn app.main:app --reload

# Test in browser
# http://localhost:8000/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "environment": "development",
  "version": "0.1.0"
}
```

---

### 2. Verify Environment Variables

Check `.env` file has:
```env
DATABASE_URL=postgresql+asyncpg://...
ENVIRONMENT=development (or production)
OPEN_METEO_TIMEOUT=30
OPEN_METEO_MAX_RETRIES=3
RATE_LIMIT_ENABLED=True
SCHEDULER_ENABLED=True
```

⚠️ **IMPORTANT**: `PORT` should NOT be in `.env` for Railway
- Railway sets PORT automatically
- Dockerfile defaults to 8000 if PORT not set

---

## Railway Deployment

### 3. Set Railway Environment Variables

In Railway dashboard:

**Required**:
```
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@db.supabase.co:5432/postgres
ENVIRONMENT=production
```

**Optional** (can use defaults):
```
DEBUG=False
LOG_LEVEL=INFO
RATE_LIMIT_PER_MINUTE=60
OPEN_METEO_TIMEOUT=30
SCHEDULER_ENABLED=True
```

⚠️ **DO NOT SET**: PORT, HOST (Railway handles these)

---

### 4. Push to GitHub

```bash
# From project root
git add .
git commit -m "Backend ready for deployment"
git push -u origin main
```

---

### 5. Railway Auto-Deploy

Railway automatically:
1. Detects `Dockerfile`
2. Builds Docker image
3. Deploys to server
4. Restarts on code changes

---

## After Deployment

### 6. Verify Deployment

**Check Health Endpoint**:
```bash
curl https://your-railway-app-url/health
```

**Expected**:
```json
{
  "status": "healthy",
  "environment": "production",
  "version": "0.1.0"
}
```

---

### 7. Test API Endpoints

**Search for city**:
```bash
curl "https://your-railway-app-url/api/v1/weather/search?query=Mumbai"
```

**Current weather**:
```bash
curl "https://your-railway-app-url/api/v1/weather/current?latitude=19.08&longitude=72.88"
```

---

### 8. Monitor Logs

In Railway dashboard → Deployments → Select deployment → View Logs

**Look for**:
```
✔ Database ready.
✔ Scheduler ready.
✔ Application started successfully.
```

**Any errors?**
- Check DATABASE_URL format
- Verify Supabase credentials
- Check if OPEN_METEO APIs are accessible

---

## Troubleshooting

### Issue: "PORT is not a valid integer"

**Cause**: PORT environment variable format issue

**Fix**:
1. Remove PORT from `.env`
2. Dockerfile will use default 8000
3. Railway will override with its PORT

### Issue: Database connection failed

**Cause**: Wrong DATABASE_URL or Supabase down

**Fix**:
1. Verify DATABASE_URL in Railway environment
2. Test connection in Supabase dashboard
3. Check if password has special characters (URL encode them: @ = %40)

### Issue: Scheduler not running

**Cause**: SCHEDULER_ENABLED=False or APScheduler issue

**Fix**:
1. Set SCHEDULER_ENABLED=True in Railway env
2. Check logs for APScheduler startup messages
3. Verify no errors in scheduler initialization

---

## Success Indicators

| Check | Status |
|-------|--------|
| `GET /health` returns 200 | ✅ |
| `GET /api/v1/weather/search` returns results | ✅ |
| `GET /api/v1/weather/current` returns data | ✅ |
| Logs show "Database ready" | ✅ |
| Logs show "Scheduler ready" | ✅ |
| No error messages in logs | ✅ |

**All green?** ✅ **Deployment successful!**

---

## Next: Frontend Setup

Once backend is deployed and verified:

1. Create React project
2. Setup Tailwind CSS
3. Build components
4. Integrate with backend
5. Deploy to Vercel

---

## Questions?

Check these files:
- `README.md` - Overview
- `QUICKSTART.md` - Quick start
- `docs/02-System-Architecture.md` - Tech details
- `DEPLOYMENT_STATUS.md` - Detailed status

---

**Created**: July 11, 2026  
**Status**: Ready to deploy ✅

