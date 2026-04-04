# Deployment Guide — LifeRemind

## Phase 1: Production Database

**Recommended: Render PostgreSQL (free tier available)**

1. Go to [render.com](https://render.com) → New → PostgreSQL
2. Create a database named `life_remind`
3. Copy the **External Database URL** (format: `postgres://user:pass@host:5432/life_remind`)

## Phase 2: Deploy Backend

### Option A — Render (recommended)

1. Push your code to GitHub
2. Go to Render → New → Web Service → Connect your repo
3. Settings:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment Variables:**
     - `DATABASE_URL` = your Render PostgreSQL connection string
     - `JWT_SECRET` = a strong random string
     - `OPENAI_API_KEY` = your OpenAI key
     - `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`
     - `NODE_ENV` = production
     - `FRONTEND_URL` = your frontend URL (for CORS)

### Option B — Railway

1. Connect GitHub repo at [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Set the same environment variables as above

## Phase 3: Deploy Frontend

### Option A — Vercel (recommended)

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Set root directory to `frontend`
3. Environment Variables:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy

### Option B — Netlify

1. Build command: `cd frontend && npm run build`
2. Publish directory: `frontend/build`
3. Set `REACT_APP_API_URL` environment variable

## Phase 4: Firebase Setup (Push Notifications)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Cloud Messaging**
4. Go to Project Settings → Service Accounts → Generate New Private Key
5. Copy `project_id`, `private_key`, and `client_email` to your backend env vars
6. For web push: go to Cloud Messaging → Web configuration → Generate VAPID key pair
7. Set `REACT_APP_FCM_VAPID_KEY` in frontend env

## Phase 5: Custom Domain (Optional)

1. Buy a domain (Namecheap, Cloudflare, Google Domains)
2. Point DNS to Vercel/Render
3. HTTPS is automatic with both Vercel and Render

## Post-Deployment Checklist

- [ ] Test registration and login
- [ ] Test creating a reminder (text and voice)
- [ ] Verify push notifications arrive
- [ ] Check scheduler logs for cron job execution
- [ ] Set up uptime monitoring (UptimeRobot — free)
