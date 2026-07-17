#!/usr/bin/env python3
"""
Firebase Hosting Deployment Script
Deploys the frontend build to Firebase Hosting
"""

import subprocess
import sys
import json
import os
from pathlib import Path

PROJECT_ID = "datamind-71f46"
DIST_DIR = "frontend/dist"
PROJECT_ROOT = Path(__file__).parent

def check_dist_exists():
    """Check if dist folder exists"""
    dist_path = PROJECT_ROOT / DIST_DIR
    if not dist_path.exists():
        print(f"❌ Error: {DIST_DIR} folder not found!")
        print("Run: cd frontend && npm run build")
        return False
    
    index_path = dist_path / "index.html"
    if not index_path.exists():
        print(f"❌ Error: {DIST_DIR}/index.html not found!")
        return False
    
    print(f"✅ Build folder found: {dist_path}")
    return True

def deploy_firebase():
    """Deploy to Firebase using CLI"""
    print("\n🚀 Deploying to Firebase Hosting...")
    print(f"Project: {PROJECT_ID}")
    print(f"Build folder: {DIST_DIR}")
    
    # Try to deploy
    cmd = [
        "firebase",
        "deploy",
        "--project", PROJECT_ID,
        "--only", "hosting",
        "-m", "Stock Intelligence Platform - Phase 2 Complete",
    ]
    
    print(f"\nRunning: {' '.join(cmd)}\n")
    
    try:
        result = subprocess.run(cmd, cwd=PROJECT_ROOT, check=False)
        
        if result.returncode == 0:
            print("\n✅ Firebase deployment successful!")
            print(f"Live at: https://{PROJECT_ID}.web.app")
            return True
        else:
            print(f"\n❌ Deployment failed with code {result.returncode}")
            print("Likely cause: Not authenticated with Firebase")
            print("\nTo fix:")
            print("1. Run: firebase login")
            print("2. Use email: officialayush292006@gmail.com")
            print("3. Then run this script again")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("Firebase Hosting Deployment")
    print("=" * 60)
    
    os.chdir(PROJECT_ROOT)
    
    # Check build exists
    if not check_dist_exists():
        return 1
    
    # Deploy
    if deploy_firebase():
        print("\n" + "=" * 60)
        print("🎉 Deployment Complete!")
        print("=" * 60)
        print(f"\n✅ Frontend live at: https://{PROJECT_ID}.web.app")
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())
