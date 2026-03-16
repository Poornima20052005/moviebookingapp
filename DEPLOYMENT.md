# Deploy Movie Booking App to Render.com

## Step 1: Go to Render Dashboard
- Open https://dashboard.render.com in your browser

## Step 2: Sign Up/Login
- Click "Sign Up" (or "Log In" if you have an account)
- Choose "Continue with GitHub" to sign up with your GitHub account

## Step 3: Access Blueprints
- In the left sidebar, look for **"Blueprints"** (or go directly to: https://dashboard.render.com/blueprints)
- Click the **"+ New Blueprint Instance"** button (blue button)

## Step 4: Connect GitHub Repository
- Click "Add Repository Access"
- Find and select: `Poornima20052005/moviebookingapp`
- Click "Add Repository"

## Step 5: Deploy Backend
- After adding repository, it will show the render.yaml configuration
- You should see one service: `moviebooking-backend` (Web Service - Python)
- Scroll down and click **"Apply Free Blueprint"**

## Step 6: Wait for Backend Deployment
- Wait 5-10 minutes for build and deploy
- Once complete, you'll see green "Live" status

## Step 7: Get Your Backend URL
- Backend API: `https://moviebooking-backend.onrender.com`
- Note this URL for the next step

## Step 8: Deploy Frontend to Vercel (Easier!)
Instead of deploying frontend to Render, use Vercel (it's free and easier):

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select `Poornima20052005/moviebookingapp`
5. Under "Build and Output Settings":
   - Framework Preset: Select "Create React App"
   - Build Command: `npm run build` (or leave blank)
   - Output Directory: `frontend/build` (or leave blank)
6. Under "Environment Variables":
   - Add: `REACT_APP_API_URL` = `https://moviebooking-backend.onrender.com/api`
7. Click "Deploy"

## Step 9: Your Live URLs!
- Backend API: `https://moviebooking-backend.onrender.com`
- Frontend: `https://your-project.vercel.app`

## Alternative: Manual Render Deployment

If you prefer to deploy everything to Render:

### Backend:
1. Click "New" → "Web Service"
2. Connect to `Poornima20052005/moviebookingapp`
3. Set:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn moviebooking.wsgi --log-file - --bind 0.0.0.0:$PORT`

### Frontend:
1. Click "New" → "Web Service" (not Static Site - it has issues)
2. Connect to `Poornima20052005/moviebookingapp`
3. Set:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s build -l $PORT`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-service.onrender.com/api`
