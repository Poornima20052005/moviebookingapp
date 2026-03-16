# Manual Deployment Guide

## PART 1: Deploy Backend to Render (Manual)

1. Go to https://dashboard.render.com
2. Click "New" in top right → Select **"Web Service"**
3. Connect your GitHub: `Poornima20052005/moviebookingapp`
4. Configure:
   - Name: `moviebooking-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn moviebooking.wsgi --log-file - --bind 0.0.0.0:$PORT`
5. Click "Deploy Web Service"
6. Wait 5 minutes - you'll get URL like: `https://moviebooking-backend.onrender.com`

## PART 2: Deploy Frontend to Vercel (Manual)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select: `Poornima20052005/moviebookingapp`
5. Configure:
   - Framework Preset: **Other**
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
6. Add Environment Variable (before deploy):
   - Key: `REACT_APP_API_URL`
   - Value: `https://moviebooking-backend.onrender.com/api` (use YOUR backend URL)
7. Click "Deploy"

## PART 3: Update Frontend API URL

After backend deploys, update the API URL in Vercel:
- Go to your Vercel project → Settings → Environment Variables
- Make sure `REACT_APP_API_URL` = `https://moviebooking-backend.onrender.com/api`

## Your Final URLs (Free):

- Backend API: `https://moviebooking-backend.onrender.com`
- Frontend: `https://your-project-name.vercel.app`
