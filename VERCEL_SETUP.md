# How to Add REACT_APP_API_URL in Vercel

## Step-by-Step:

1. **Go to Vercel Dashboard**
   - Open https://vercel.com/dashboard

2. **Select Your Project**
   - Click on your moviebooking project

3. **Go to Settings**
   - Click the "Settings" tab (gear icon) on your project page

4. **Find Environment Variables**
   - Scroll down to "Environment Variables" section
   - OR go directly: https://vercel.com/YOUR_USERNAME/YOUR_PROJECT/settings/environment-variables

5. **Add New Variable**
   - Click "Add New" button
   - Field 1 (Key): `REACT_APP_API_URL`
   - Field 2 (Value): `https://moviebooking-backend.onrender.com/api`
   - Field 3 (Environments): Select "Production", "Preview", and "Development"

6. **Click "Save"**

7. **Redeploy (if already deployed)**
   - Go to "Deployments" tab
   - Click "..." next to latest deployment
   - Click "Redeploy"

## Quick Summary:
Settings → Environment Variables → Add New
- Key: REACT_APP_API_URL
- Value: https://moviebooking-backend.onrender.com/api
