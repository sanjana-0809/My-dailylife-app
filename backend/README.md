# LifeRemind Backend

Express.js REST API with PostgreSQL, OpenAI Whisper, and Firebase FCM.

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login (returns JWT)
- `POST /api/auth/logout` — Logout
- `PUT /api/auth/update-phone-token` — Update FCM token
- `GET /api/auth/me` — Get current user

### Reminders
- `POST /api/reminders/voice` — Voice → transcribe → create reminder
- `POST /api/reminders` — Create text reminder (supports `naturalText` for auto-parsing)
- `GET /api/reminders` — List all (filter: `?status=active`)
- `GET /api/reminders/today` — Today's reminders
- `GET /api/reminders/:id` — Single reminder
- `PATCH /api/reminders/:id` — Update
- `PATCH /api/reminders/:id/mark-complete` — Mark done
- `DELETE /api/reminders/:id` — Delete

### Habits
- `POST /api/habits` — Create habit
- `GET /api/habits` — List all
- `PATCH /api/habits/:id/complete` — Mark done today
- `PATCH /api/habits/:id` — Update
- `DELETE /api/habits/:id` — Delete

### Dashboard
- `GET /api/dashboard` — Today view + stats

### Notifications
- `PATCH /api/notifications/:id/done` — Mark from notification
- `PATCH /api/notifications/:id/snooze` — Snooze (default 15 min)
- `GET /api/notifications/history` — Delivery log

## Scripts
```bash
npm start        # Start server
npm run dev      # Start with nodemon (hot reload)
npm run init-db  # Create database tables
npm run seed     # Seed test data
```
