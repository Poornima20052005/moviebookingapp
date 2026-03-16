# Vercel Deployment Settings (FIXED)

The frontend is in the `frontend/` subfolder, so you need to use:

## Settings:

1. **Framework Preset**: "Other"

2. **Build Command** (click Override):
```
cd frontend && npm install && npm run build
```

3. **Output Directory** (click Override):
```
frontend/build
```

4. **Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://moviebooking-backend.onrender.com/api`

## Important:
- Make sure to include `cd frontend` in the build command!
- The Output Directory should be `frontend/build` (not just `build`)
