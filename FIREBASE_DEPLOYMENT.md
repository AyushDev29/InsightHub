# Firebase Hosting Deployment Guide

## 🚀 Quick Start

Your app is configured to deploy on Firebase Hosting. Follow these steps to go live.

---

## Prerequisites

1. **Node.js** - Already have it
2. **Firebase CLI** - Install if you don't have it
3. **Firebase Account** - Already set up (datamind-71f46 project)

---

## Installation & Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window to authenticate with your Google account.

### Step 3: Verify Firebase Configuration

```bash
firebase projects:list
```

You should see `datamind-71f46` in the list.

---

## Building & Deploying

### Step 1: Build the Frontend

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/dist/`

### Step 2: Deploy to Firebase

From the project root directory:

```bash
firebase deploy
```

The deployment will:
- Upload your app to Firebase Hosting
- Generate a live URL (usually `https://datamind-71f46.web.app`)
- Set up automatic HTTPS
- Configure caching headers

### Step 3: Verify Deployment

```bash
firebase open hosting
```

This opens your live app in the browser.

---

## Expected Output

```
=== Deploying to 'datamind-71f46'...

i  deploying hosting
i  hosting[datamind-71f46]: beginning deploy...
i  hosting[datamind-71f46]: found 45 files in frontend/dist
✔  hosting[datamind-71f46]: file uploading complete
✔  hosting[datamind-71f46]: finalizing version...
✔  hosting[datamind-71f46]: version finalized
✔  hosting[datamind-71f46]: released and live!

Visit your site at: https://datamind-71f46.web.app
```

---

## Your Live URLs

Once deployed:
- **Main URL:** `https://datamind-71f46.web.app`
- **Preview Channel:** `https://datamind-71f46.firebaseapp.com`

---

## Configuration Details

### Firebase Project
- **Project ID:** datamind-71f46
- **Auth Domain:** datamind-71f46.firebaseapp.com
- **Storage Bucket:** datamind-71f46.firebasestorage.app

### Hosting Configuration
- **Source Directory:** `frontend/dist` (built files)
- **Rewrite Rules:** All routes redirect to `/index.html` (for React Router)
- **Cache Headers:**
  - JS/CSS files: 1 year cache (max-age=31536000)
  - HTML files: No cache (max-age=0)

### Analytics Integration
- **Measurement ID:** G-R8WGD47F42
- Tracks page views, user interactions, and performance metrics

---

## Backend API Configuration

⚠️ **Important:** Your frontend talks to your backend API. Make sure:

1. **Backend is deployed** (e.g., Railway, Heroku, or similar)
2. **CORS is configured** in your backend to allow requests from Firebase domain
3. **Update API base URL** if backend changes:

```typescript
// frontend/src/services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com'
```

---

## Continuous Deployment (Optional)

To auto-deploy on every push to main branch:

### Using GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: cd frontend && npm install && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: datamind-71f46
```

---

## Troubleshooting

### Issue: "Permission denied" when deploying

**Solution:** Make sure you're logged in:
```bash
firebase login
```

### Issue: Files not updating after deploy

**Solution:** Clear cache or do a hard refresh:
- Windows/Linux: `Ctrl + Shift + Delete`
- Mac: `Cmd + Shift + Delete`

### Issue: 404 errors on page refresh

**Solution:** Already configured! The `rewrites` rule in `firebase.json` handles this by redirecting all routes to `/index.html`.

### Issue: API calls returning 404

**Solution:** Verify backend is running and CORS is enabled:
```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://datamind-71f46.web.app", "localhost"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Performance Optimization

Your app is optimized for Firebase:

- ✅ **Code Splitting:** Lazy-loaded routes with React Router
- ✅ **Image Optimization:** Assets compressed and cached
- ✅ **CSS Minification:** Tailwind CSS is tree-shaken
- ✅ **JS Minification:** React built in production mode
- ✅ **Caching:** Long-term caching for assets

---

## Monitoring

After deployment, monitor your app:

1. **Analytics:** Google Analytics tracks user behavior
2. **Performance:** Firebase Console shows build metrics
3. **Errors:** Check browser console for any issues

Access Firebase Console:
```bash
firebase console
```

---

## Rollback (If Needed)

To revert to a previous version:

```bash
firebase hosting:releases
firebase hosting:rollback
```

---

## Next Steps

1. **Build the frontend:** `npm run build`
2. **Deploy to Firebase:** `firebase deploy`
3. **Share your URL:** `https://datamind-71f46.web.app`
4. **Monitor analytics:** Check Firebase Console

---

## Support

For Firebase issues:
- Firebase Docs: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com
- Firebase CLI Docs: https://firebase.google.com/docs/cli

---

**Last Updated:** July 12, 2026
**Status:** Ready for Deployment ✅
