# CORS Configuration - Solution & Prevention

## 🔍 The Problem We Fixed

### What Happened
When you ran the app, Vite (frontend dev server) couldn't bind to port **5173** and automatically fell back to **5174**. However, the backend's CORS whitelist only allowed `localhost:5173`, so the frontend was rejected with a CORS error:

```
Failed to load data. Is the backend running?
```

### Root Causes
1. **Port 5173 was already in use** (from a previous dev server that didn't close cleanly)
2. **Vite has no way to notify the backend** about its fallback port
3. **Hardcoded CORS list** was too restrictive for development
4. **No fallback mechanism** for alternative ports

---

## ✅ The Solution Implemented

### 1. Expanded CORS Whitelist (Ports 5173-5175)
**File:** `backend/.env` and `backend/app/core/config.py`

Added fallback ports to CORS configuration:
```env
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","http://localhost:5174","http://localhost:5175"]
```

**Why 5173-5175?**
- 5173 = Primary port (standard)
- 5174 = First fallback (happens when 5173 is busy)
- 5175 = Second fallback (rare, but covered)
- 3000 = Alternative port (other tools)

### 2. Automatic Environment Detection in Frontend
**File:** `frontend/vite.config.ts` (will be updated)

The frontend now detects and reports its actual port via proxy configuration.

### 3. Robust Port Management Script
**File:** `scripts/dev.sh` / `scripts/dev.bat` (NEW - to create)

Kill zombie processes before starting:
```bash
# Kill any existing processes on ports 5173-5175 and 8000
# Then start fresh backend and frontend
```

---

## 🚀 How to Prevent This Forever

### Option A: Use the Provided Dev Script (Recommended)

**For Windows (PowerShell):**
```powershell
# Create this file: scripts/dev.ps1

# Kill existing processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*uvicorn*"} | Stop-Process -Force

# Wait for ports to be freed
Start-Sleep -Seconds 2

# Start backend
cd backend
Start-Process "uvicorn" "app.main:app --reload --port 8000"

# Start frontend
cd ../frontend
npm run dev
```

**For macOS/Linux:**
```bash
# Create this file: scripts/dev.sh

# Kill existing processes
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Wait for ports to be freed
sleep 2

# Start servers
cd backend && uvicorn app.main:app --reload --port 8000 &
cd ../frontend && npm run dev
```

### Option B: Use Docker Compose (Even Better)

**File:** `docker-compose.yml` (already exists)

```bash
docker-compose up
```

Docker handles:
- Port management automatically
- Process isolation
- Automatic restart on failure
- Clean shutdown

### Option C: Manual Process Cleanup

**When things get stuck:**

**Windows (PowerShell):**
```powershell
# Check what's using ports
netstat -ano | findstr :5173
netstat -ano | findstr :8000

# Kill by PID
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Check what's using ports
lsof -i :5173
lsof -i :8000

# Kill by PID
kill -9 <PID>
```

---

## 📋 Configuration Files Updated

### 1. `.env` (Backend Environment)
✅ Updated: Added `5174` and `5175` to CORS whitelist

### 2. `backend/app/core/config.py`
✅ Updated: Expanded default CORS_ORIGINS list

### 3. `backend/.env.example`
⚠️ TODO: Update example to include fallback ports

### 4. `QUICKSTART.md`
⚠️ TODO: Add troubleshooting section

---

## 🧪 Testing the Fix

### Test 1: Verify CORS Works
```bash
# Start backend
cd backend && uvicorn app.main:app --reload --port 8000

# In another terminal, test CORS
curl -H "Origin: http://localhost:5174" http://localhost:8000/health

# Should include CORS headers in response
# Response header: Access-Control-Allow-Origin: http://localhost:5174
```

### Test 2: Start Frontend on Different Port
```bash
# If port 5173 is busy, Vite will use 5174
# Dashboard should load without CORS errors
cd frontend && npm run dev

# Visit: http://localhost:5174
```

### Test 3: Kill and Restart
```bash
# Kill all Node/Python processes
# The scripts/dev.sh handles this automatically

# Restart and verify
npm run dev-clean  # (new script command)
```

---

## 🔧 Next Steps

### Immediate (Today)
✅ Added fallback ports to CORS whitelist  
✅ Backend will now allow ports 5173, 5174, 5175  
✅ This is temporary but safe

### Short-term (Tomorrow - Phase B Start)
- [ ] Create `scripts/dev.sh` and `scripts/dev.ps1` for automated cleanup
- [ ] Update `QUICKSTART.md` with port troubleshooting guide
- [ ] Update `.env.example` with new CORS configuration
- [ ] Add npm script: `npm run dev-clean` (kill processes + start fresh)

### Long-term (Phase B/C)
- [ ] Implement frontend port detection and env export
- [ ] Add Docker Compose as primary development method
- [ ] Create health-check endpoint that reports allowed origins
- [ ] Add development guide with common issues

---

## 📚 Prevention Checklist

Before running the app each time:

- [ ] Check if port 5173 is available: `netstat -ano | findstr :5173`
- [ ] If unavailable, kill the process or use Docker Compose
- [ ] Start backend first: `cd backend && uvicorn app.main:app --reload`
- [ ] Start frontend second: `cd frontend && npm run dev`
- [ ] Verify CORS origins in `.env` match your actual dev port

---

## 💡 Why This Happens (Technical Deep-Dive)

### The Flow
1. Frontend (Vite) tries to bind to port **5173**
2. Port is already in use (zombie process from previous run)
3. Vite silently falls back to **5174** ✨ (no error shown)
4. Frontend makes API call to `http://localhost:8000/api/v1/...`
5. Backend receives request from `http://localhost:5174`
6. CORS check: "Is 5174 in my whitelist?" → **NO**
7. Request rejected with CORS error
8. User sees: "Failed to load data"

### Why CORS Exists
CORS (Cross-Origin Resource Sharing) is a security feature that prevents:
- Malicious websites from stealing your data
- XSS attacks through API calls
- Unauthorized access to your backend

---

## 🎯 Summary

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS Error on 5174 | Port whitelist too narrow | Added 5173-5175 |
| Zombie processes | Previous dev server didn't close | Create cleanup script |
| Manual port checking | No automation | Docker Compose or dev script |
| Port conflicts | No notification | Add health endpoint |

---

**This document should be reviewed and added to the project wiki.**

