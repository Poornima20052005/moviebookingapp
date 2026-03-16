# Vercel Deployment Settings

## Fill in these fields in Vercel:

### Project Settings:

1. **Framework Preset**: Other

2. **Build Command**: 
```
cd frontend && npm install && npm run build
```

3. **Output Directory**: 
```
frontend/build
```

4. **Environment Variables** (click "Add"):
   - Key: `REACT_APP_API_URL`
   - Value: `https://moviebooking-backend.onrender.com/api`

### Important:
- After entering the Build Command and Output Directory, make sure to click the toggle for "Override" next to each if they appear
- Then click "Deploy"

## If you see different fields:
- If Build Command field says "What build command do you want to use?" → type: `cd frontend && npm install && npm run build`
- If Output Directory field says "What is the output directory?" → type: `frontend/build`
- If Framework Preset asks to select → choose "Other"
