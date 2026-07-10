#!/bin/bash

echo "================================================"
echo " InsightHub AI - Backend Startup Script"
echo "================================================"
echo

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt --quiet
echo

# Create logs directory
mkdir -p logs

# Start the server
echo "================================================"
echo " Starting InsightHub AI Backend..."
echo "================================================"
echo
echo "Server will start at: http://localhost:8000"
echo "API Docs: http://localhost:8000/api/docs"
echo
echo "Press Ctrl+C to stop the server"
echo

uvicorn app.main:app --reload
