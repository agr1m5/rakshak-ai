# Rakshak

An AI-powered cybersecurity assistant — answers security questions, analyzes
uploaded logs, detects suspicious activity, and generates incident reports.

## Structure

```
rakshak/
├── client/   React + Vite + Tailwind frontend
└── server/   Node + Express + MongoDB backend
```

Each has its own `package.json` and is run independently.

## Getting started

**Backend:**
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI (MongoDB Atlas), etc.
npm run dev
```

**Frontend** (separate terminal):
```bash
cd client
npm install
cp .env.example .env   # points VITE_API_URL at the backend
npm run dev
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.

## Build log

Progress so far:
- [x] Step 1 — Architecture design
- [x] Step 2 — Frontend initialized (Vite + React + Tailwind + routing)
- [x] Step 3 — Backend initialized (Express skeleton, health check)
- [x] Step 4 — MongoDB configured (Atlas connection, Mongoose schemas)
- [ ] Step 5 — JWT authentication
- [ ] Step 6 — Dashboard
- [ ] Step 7 — Chat UI
- [ ] Step 8 — AI integration
- [ ] Step 9 — Log upload
- [ ] Step 10 — Log parser
- [ ] Step 11 — Threat detection
- [ ] Step 12 — Threat intelligence APIs
- [ ] Step 13 — Report generator
- [ ] Step 14 — Charts
- [ ] Step 15 — Deployment
