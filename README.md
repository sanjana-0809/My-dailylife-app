# ⏰ LifeRemind — Personal Voice-Driven Life Tracker

A full-stack web app for managing reminders and habits with voice input, natural language date parsing, and push notifications.

## Features

- **Voice Capture** — Record reminders as voice notes (transcribed via OpenAI Whisper)
- **Smart Date Parsing** — Understands "March 15th at 7 PM", "next Tuesday", "in 3 days"
- **Push Notifications** — Firebase FCM alerts at the exact scheduled time
- **Habit Tracking** — Daily/weekly/monthly habits with streak counting
- **Calendar View** — See all reminders on a month calendar
- **Archive** — Browse completed reminders as a personal journal

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, PostgreSQL |
| Frontend | React 18, Tailwind CSS, React Router |
| Voice | OpenAI Whisper API |
| Notifications | Firebase Cloud Messaging (FCM) |
| Date Parsing | chrono-node + date-fns |
| Scheduling | node-cron |

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js 18+** — [Download](https://nodejs.org/)
- **PostgreSQL 14+** — [Download](https://www.postgresql.org/download/) or use Docker

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd life-remind

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### Step 2: Set Up PostgreSQL

**Option A — Docker (recommended):**
```bash
docker-compose up -d
```

**Option B — Local PostgreSQL:**
```bash
psql -U postgres -c "CREATE DATABASE life_remind;"
```

### Step 3: Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials:
#   - DATABASE_URL (if not using Docker defaults)
#   - OPENAI_API_KEY (for voice transcription)
#   - FIREBASE_* credentials (for push notifications)

# Frontend
cp frontend/.env.example frontend/.env
```

### Step 4: Initialize Database

```bash
cd backend
npm run init-db     # Creates tables
npm run seed        # (Optional) Adds test data
```

### Step 5: Start the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev         # Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm start           # Runs on http://localhost:3000
```

### Step 6: Test It Out

1. Open **http://localhost:3000**
2. Register a new account (or login with `test@liferemind.app` / `password123` if you ran seed)
3. Try voice input or create a reminder manually
4. Check the Calendar, Habits, and Archive pages

---

## API Credentials You'll Need

| Service | What For | Get It From |
|---------|----------|-------------|
| OpenAI API Key | Voice transcription (Whisper) | [platform.openai.com](https://platform.openai.com/) |
| Firebase Credentials | Push notifications | [console.firebase.google.com](https://console.firebase.google.com/) |

> **Note:** The app works without these — voice input and push notifications will be disabled, but text reminders, habits, and the calendar all work without any API keys.

---

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

**Quick summary:**
1. Deploy PostgreSQL (Render, Railway, Supabase, or AWS RDS)
2. Deploy backend to Render/Railway (set env vars in dashboard)
3. Build & deploy frontend to Vercel/Netlify
4. Configure Firebase for push notifications

---

## Project Structure

```
life-remind/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express entry point
│   │   ├── config/           # Database & Firebase config
│   │   ├── models/           # DB schemas & queries
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Voice, date parsing, notifications
│   │   ├── middleware/       # Auth, error handling, logging
│   │   ├── utils/            # Validators, helpers
│   │   └── scripts/          # DB init & seed scripts
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Root component + routing
│   │   ├── pages/            # Today, Calendar, Habits, Reminders, Archive
│   │   ├── components/       # VoiceInput, ReminderCard, HabitTracker, etc.
│   │   ├── hooks/            # useVoice, useHabits, useAuth
│   │   ├── context/          # AuthContext, RemindersContext
│   │   ├── services/         # Axios API client
│   │   └── styles/           # Tailwind + animations
│   ├── package.json
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

---

## License

MIT — Built for personal use.
