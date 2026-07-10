# 🚀 How To Run InsightHub AI Backend

## Step-by-Step Instructions (Windows)

### Step 1: Open Terminal in Backend Folder

```bash
cd InsightHub-AI/backend
```

### Step 2: Run the Startup Script

```bash
start.bat
```

**That's it!** The script will automatically:
- ✅ Create virtual environment (if not exists)
- ✅ Activate virtual environment
- ✅ Install all dependencies
- ✅ Start the server

---

## ✅ Server Started!

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Your backend is now running at:**
- 🌐 API: http://localhost:8000
- 📚 Docs: http://localhost:8000/api/docs
- 📖 ReDoc: http://localhost:8000/api/redoc

---

## 🧪 Test It!

### Option 1: Run Test Script (Recommended)

**Open a NEW terminal** and run:

```bash
cd InsightHub-AI/backend
python test_api.py
```

You should see:
```
🚀 InsightHub AI - Backend API Tests
=====================================

✅ All Tests Completed!
🎉 Your backend is working perfectly!
```

---

### Option 2: Test in Browser

Open: **http://localhost:8000/api/docs**

This will open Swagger UI where you can:
1. Click any endpoint
2. Click "Try it out"
3. Enter parameters
4. Click "Execute"
5. See the response!

---

### Option 3: Test with Curl

```bash
# Test health
curl http://localhost:8000/health

# Test current weather (Mumbai)
curl "http://localhost:8000/api/v1/weather/current?latitude=19.0760&longitude=72.8777"

# Test location search
curl "http://localhost:8000/api/v1/weather/search?query=Mumbai"
```

---

## 📋 All Available Endpoints

### 1. Current Weather
```
GET /api/v1/weather/current?latitude=19.076&longitude=72.877
```

### 2. Hourly Forecast
```
GET /api/v1/weather/hourly?latitude=19.076&longitude=72.877&hours=24
```

### 3. Daily Forecast
```
GET /api/v1/weather/daily?latitude=19.076&longitude=72.877&days=7
```

### 4. Historical Weather
```
GET /api/v1/weather/history?latitude=19.076&longitude=72.877&start_date=2024-07-01&end_date=2024-07-07
```

### 5. Air Quality
```
GET /api/v1/weather/air-quality?latitude=19.076&longitude=72.877
```

### 6. Location Search
```
GET /api/v1/weather/search?query=Mumbai&count=5
```

---

## 🌍 Try Different Cities!

### Indian Cities
```bash
# Mumbai
latitude=19.0760&longitude=72.8777

# Delhi
latitude=28.7041&longitude=77.1025

# Bangalore
latitude=12.9716&longitude=77.5946

# Chennai
latitude=13.0827&longitude=80.2707

# Kolkata
latitude=22.5726&longitude=88.3639
```

### World Cities
```bash
# New York
latitude=40.7128&longitude=-74.0060

# London
latitude=51.5074&longitude=-0.1278

# Tokyo
latitude=35.6762&longitude=139.6503

# Dubai
latitude=25.2048&longitude=55.2708
```

---

## 🛑 How to Stop the Server

Press **Ctrl + C** in the terminal where server is running.

---

## 🔧 Troubleshooting

### Problem: "Port 8000 is already in use"

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID_NUMBER> /F

# Start server again
start.bat
```

---

### Problem: "Module not found"

**Solution:**
```bash
# Make sure you're in backend folder
cd InsightHub-AI/backend

# Activate virtual environment
venv\Scripts\activate

# Install dependencies again
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload
```

---

### Problem: "Cannot connect to server"

**Solution:**
1. Make sure server is running (check terminal)
2. Wait a few seconds for server to start
3. Try http://localhost:8000/health first
4. Check if any firewall is blocking

---

## 📚 Next Steps

1. ✅ **Test all endpoints** - Use Swagger UI
2. ✅ **Try different cities** - Use location search
3. ✅ **Check the logs** - See what's happening
4. ✅ **Read the docs** - Check `backend/README.md`

---

## 🎉 Success Indicators

You know it's working when:

- ✅ Server starts without errors
- ✅ Health endpoint returns 200
- ✅ Test script passes all tests
- ✅ Swagger UI loads
- ✅ All 6 endpoints return data

---

## 💻 Development Mode

Server runs in **reload mode** by default:
- Any code change automatically restarts server
- No need to manually restart
- Perfect for development!

---

## 📁 Important Files

```
backend/
├── .env              # Configuration (already set up)
├── start.bat         # Windows startup script
├── start.sh          # Linux/Mac startup script
├── test_api.py       # Test all endpoints
├── README.md         # Detailed documentation
└── app/              # Application code
    ├── main.py       # FastAPI application
    ├── api/          # API endpoints
    └── services/     # Business logic
```

---

## 🎯 Quick Commands

```bash
# Start server
start.bat

# Test APIs
python test_api.py

# Install new package
pip install package-name

# View logs
# Just look at the terminal where server is running
```

---

## ✅ Verification Checklist

- [ ] Terminal opened in `InsightHub-AI/backend`
- [ ] Run `start.bat`
- [ ] Server started successfully
- [ ] Visited http://localhost:8000/health
- [ ] Got `{"status": "healthy"}` response
- [ ] Opened http://localhost:8000/api/docs
- [ ] Tested at least one endpoint
- [ ] Run `python test_api.py` successfully

**If all above checked, you're good to go! 🎉**

---

## 🆘 Need Help?

1. Check `backend/README.md` for detailed docs
2. Check `BACKEND_COMPLETE.md` for summary
3. Visit http://localhost:8000/api/docs
4. Check server logs in terminal

---

**Enjoy building with InsightHub AI! 🚀**

**Your backend is production-ready and waiting for the frontend!**
