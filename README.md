# Rakshak

An AI-powered cybersecurity assistant — answers security questions, analyzes
uploaded logs, detects suspicious activity, and generates incident reports.

## Structure

```
rakshak/
├── client/                  React + Vite + Tailwind frontend
├── server/                  Node + Express + MongoDB backend
└── log-template-service/    Python + FastAPI + Drain3 (optional log anomaly detection)
```

Each has its own dependency setup and is run independently.

## Getting started

**Backend:**
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI (MongoDB Atlas), JWT_SECRET, etc.
npm run dev
```

**Frontend** (separate terminal):
```bash
cd client
npm install
cp .env.example .env   # points VITE_API_URL at the backend
npm run dev
```

Backend runs on `http://localhost:5000` by default (on macOS, if port 5000
conflicts with AirPlay Receiver, set `PORT=5001` in `server/.env` and match
it in `client/.env`'s `VITE_API_URL`). Frontend runs on `http://localhost:5173`.

**AI (Ollama, default):**
```bash
ollama pull llama3.2
ollama serve
```
See `server/README.md` for full AI provider setup (Ollama or OpenAI).

**Log template mining (optional, separate terminal):**
```bash
cd log-template-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```
Adds anomaly detection on top of regex-based threat detection. Fully
optional — log parsing works without it. See `log-template-service/README.md`.

## Build log

Progress so far:
- [x] Step 1 — Architecture design
- [x] Step 2 — Frontend initialized (Vite + React + Tailwind + routing)
- [x] Step 3 — Backend initialized (Express skeleton, health check)
- [x] Step 4 — MongoDB configured (Atlas connection, Mongoose schemas)
- [x] Step 5 — JWT authentication (signup, login, protected routes)
- [x] Step 6 — Dashboard (live stats, Chart.js severity chart)
- [x] Step 7 — Chat UI (conversations, message thread, persistence)
- [x] Step 8 — AI integration (Ollama default, OpenAI switchable)
- [x] Step 9 — Log upload (Multer, per-user storage, drag & drop UI)
- [x] Step 10 — Log parser (IPs, URLs, status codes, failed logins, flagged requests)
- [x] Step 11 — Threat detection (classified threats, severity, AI explanations, + Drain3 anomaly detection)
- [x] Step 12 — Threat intelligence (VirusTotal, CVE/NVD, MITRE ATT&CK, OWASP Top 10)
- [x] Step 13 — Incident reports (PDF generation, AI executive summary, mitigations, timeline)
- [ ] Step 14 — Charts

## Rakshak Live (pivot in progress)

See `rakshak-live-architecture.md` and `rakshak-live-prompt.md` for the
full design. Local-only detection: raw activity never leaves the machine,
only classified findings do.

- [x] Phase 1 — Findings ingestion: Socket.IO server, agent pairing (separate revocable token), `CorrelatedIncident` model, `Threat.source` field. Tested with simulated findings, no real agent yet.
- [ ] Phase 2 — The real local agent: log/process/network collectors + local detection + local correlation
- [ ] Phase 3 — Live Operations Dashboard (real-time feed, replacing the static dashboard)
- [ ] Phase 4 — Desktop App Shell (Electron): menu bar icon, notifications, launch at login, packaged `.dmg`
- [ ] Phase 5 — Security hardening pass
