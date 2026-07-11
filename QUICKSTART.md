# InsightHub AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will get you up and running with InsightHub AI for development.

---

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js (need 20+)
node --version

# Check Python (need 3.12+)
python --version

# Check PostgreSQL (need 15+)
psql --version

# Check Docker (optional)
docker --version
```

---

## Option 1: Manual Setup (Recommended for Development)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/insighthub-ai.git
cd insighthub-ai
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env and configure your database URL
# DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/insighthub
```

### Step 3: Database Setup

```bash
# Create database
createdb insighthub

# Or using psql:
psql -U postgres -c "CREATE DATABASE insighthub;"

# Run migrations
alembic upgrade head

# Optional: Seed sample data
python scripts/seed_db.py
```

### Step 4: Start Backend

```bash
# From backend directory
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at: `http://localhost:8000`  
📚 API Docs: `http://localhost:8000/api/docs`

### Step 5: Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Setup environment
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
# or
yarn dev
```

✅ Frontend running at: `http://localhost:3000`

### Step 6: Scheduler Setup (Optional, New Terminal)

```bash
cd scheduler

# Activate backend virtual environment
# Windows:
..\backend\venv\Scripts\activate
# macOS/Linux:
source ../backend/venv/bin/activate

# Run scheduler
python scheduler.py
```

✅ Scheduler running - will fetch data hourly

---

## Option 2: Docker Setup (Easiest)

### Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/yourusername/insighthub-ai.git
cd insighthub-ai

# Copy environment file
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Start all services
docker-compose up

# Or run in background
docker-compose up -d
```

**That's it!** All services will start automatically.

✅ Frontend: `http://localhost:3000`  
✅ Backend: `http://localhost:8000`  
✅ Database: `localhost:5432`

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Run migrations
docker-compose exec backend alembic upgrade head
```

---

## Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "development",
  "version": "0.1.0"
}
```

### 2. Check API Documentation

Visit: `http://localhost:8000/api/docs`

You should see Swagger UI with all available endpoints.

### 3. Check Frontend

Visit: `http://localhost:3000`

You should see the InsightHub AI dashboard.

---

## Project Structure Overview

```
InsightHub-AI/
├── frontend/          # React app (port 3000)
├── backend/           # FastAPI app (port 8000)
├── scheduler/         # Data collection jobs
├── database/          # Database migrations
├── docs/              # Documentation
└── config/            # Shared configuration
```

---

## Next Steps

### For Developers

1. **Read Documentation**
   - [Product Requirements](docs/01-PRD.md)
   - [System Architecture](docs/02-System-Architecture.md)
   - [Database Design](docs/03-Database-Design.md)
   - [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)

2. **Setup Your IDE**
   - Install Python and TypeScript extensions
   - Configure linters (Black, ESLint)
   - Setup formatters (Prettier)

3. **Start Coding**
   - Check [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for tasks
   - Pick a feature from the backlog
   - Create a feature branch
   - Make changes
   - Submit a PR

### For Product Managers

1. **Review Requirements**
   - Read [PRD](docs/01-PRD.md)
   - Review [Roadmap](docs/09-Roadmap.md)
   - Check [Meeting Notes](docs/10-Meeting-Notes.md)

2. **Test Features**
   - Try the live demo
   - Report issues
   - Suggest improvements

### For Designers

1. **Review Design System**
   - Check [Frontend Design](docs/05-Frontend-Design.md)
   - Review component library
   - Test responsive layouts

2. **Contribute**
   - Design new features
   - Improve UX
   - Create mockups

---

## Common Issues & Solutions

### Backend won't start

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

---

**Issue**: `sqlalchemy.exc.OperationalError: connection refused`

**Solution**:
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check database exists: `psql -l`

---

### Frontend won't start

**Issue**: `Cannot find module 'react'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

**Issue**: `Network Error` when calling API

**Solution**:
- Verify backend is running on port 8000
- Check VITE_API_URL in frontend/.env
- Check CORS settings in backend

---

### Docker Issues

**Issue**: `Port already in use`

**Solution**:
```bash
# Stop conflicting services
docker-compose down

# Or change ports in docker-compose.yml
```

---

**Issue**: `Cannot connect to database`

**Solution**:
```bash
# Restart database container
docker-compose restart database

# Check database logs
docker-compose logs database
```

---

### CORS & Port Issues (New!)

**Issue**: `Failed to load data. Is the backend running?` in Frontend

**Root Cause**: Frontend running on unexpected port (e.g., 5174) but backend's CORS whitelist only allows 5173

**Solution 1 - Use Clean Start Script (Recommended)**:
```bash
# Windows - Double-click this file:
scripts/dev-clean.bat

# Or from command line:
cd scripts
dev-clean.bat

# Windows PowerShell:
.\dev-clean.ps1
```

**Solution 2 - Manual Cleanup**:
```bash
# Windows - Kill existing processes
taskkill /IM node.exe /F
taskkill /IM python.exe /F

# Wait 2 seconds
timeout /t 2

# Then start normally
cd backend && python -m uvicorn app.main:app --reload
# In another terminal:
cd frontend && npm run dev
```

**Solution 3 - Check Port Usage**:
```bash
# Windows - See what's using port 5173
netstat -ano | findstr :5173

# Kill by Process ID
taskkill /PID <PID> /F
```

**Prevention**: The CORS whitelist now includes ports 5173-5175 to handle automatic fallback. If Vite can't use 5173, it will use 5174 or 5175, and the backend will accept requests from all three ports.

For detailed explanation, see: [CORS_SOLUTION.md](CORS_SOLUTION.md)

---

## Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Start services
# Terminal 1: Backend
cd backend && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Optional - Scheduler
cd scheduler && python scheduler.py

# 4. Make changes and test

# 5. Run tests
# Backend
pytest
# Frontend
npm run test

# 6. Commit and push
git add .
git commit -m "feat: add amazing feature"
git push origin feature/my-feature

# 7. Create Pull Request on GitHub
```

---

## Useful Commands

### Backend

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Format code
black app/

# Lint code
flake8 app/

# Type check
mypy app/

# Create migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Database

```bash
# Connect to database
psql -d insighthub

# Backup database
pg_dump insighthub > backup.sql

# Restore database
psql insighthub < backup.sql

# View tables
psql -d insighthub -c "\dt"

# View table schema
psql -d insighthub -c "\d locations"
```

---

## Environment Variables

### Backend (.env)

```env
# Required
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/insighthub
APP_NAME=InsightHub AI
ENVIRONMENT=development

# Optional
DEBUG=True
LOG_LEVEL=INFO
SCHEDULER_ENABLED=True
```

### Frontend (.env)

```env
# Required
VITE_API_URL=http://localhost:8000

# Optional
VITE_APP_NAME=InsightHub AI
VITE_ENVIRONMENT=development
```

---

## Getting Help

### Resources

- **Documentation**: `/docs` folder
- **API Docs**: `http://localhost:8000/api/docs`
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/insighthub-ai/issues)

### Community

- Ask questions in Discussions
- Join our Discord/Slack
- Follow development updates

---

## What's Next?

Once you're set up:

1. ✅ Explore the codebase
2. ✅ Read the documentation
3. ✅ Pick a task from [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)
4. ✅ Start building!

---

**Happy Coding! 🚀**

---

**Last Updated**: July 10, 2026  
**Version**: 1.0
