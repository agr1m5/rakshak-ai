# Rakshak — client

Frontend for Rakshak, an AI cybersecurity assistant. Built with React, Vite, Tailwind CSS, and React Router.

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend once it exists
npm run dev
```

## Design system

- **Ink** — dark surface scale (`ink-950` page bg → `ink-700` borders) used throughout.
- **Sentinel** — signature scanning-teal accent (`sentinel-400` / `#38E1C6`), reserved for brand and interactive accents.
- **Severity** — a separate palette (`severity-low/medium/high/critical`) used only for threat/severity data, never for brand UI, so the two never get confused.
- **Type** — Space Grotesk (display), Inter (body/UI), JetBrains Mono (data: logs, IPs, timestamps, badges).

See `tailwind.config.js` for the full token set.
