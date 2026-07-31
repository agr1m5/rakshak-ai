# Rakshak — log template service

A small FastAPI microservice wrapping [Drain3](https://github.com/logpai/Drain3)
(the maintained, production-ready port of LogPAI's Drain log-parsing
algorithm) for **log template mining** — clustering log lines into
structural templates so genuinely rare/unusual lines can be surfaced as a
supplementary signal on top of Rakshak's regex-based attack detection.

## Why this exists

Regex patterns (Step 10/11) catch *known* attack signatures — `' OR '1'='1`,
`<script>`, `../../`, etc. They can't catch what they don't know to look
for. Drain3 instead asks a structural question: "does this line look like
the rest of this log, or not?" A line that's structurally rare gets flagged
as `anomalous_pattern` (low severity — it's a "worth a look", not a
confirmed attack) even if no regex matches it.

## What it is NOT

It has no built-in concept of SQLi, XSS, CVEs, or any named attack — it's
purely clustering. All severity/classification logic lives on the Node
side (`server/services/threatDetectionService.js`).

## Setup

```bash
cd log-template-service
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                  # runs on http://localhost:8001
```

Verify it's up:
```bash
curl http://localhost:8001/health
```

## How it's used

`server/services/logParser/templateMiningClient.js` calls `POST /mine`
with a log's lines, gets back a cluster ID per line, and flags lines in
clusters smaller than ~3% of the log as "rare." **This is entirely
optional at runtime** — if this service isn't running, `server/.env`'s
`LOG_TEMPLATE_SERVICE_ENABLED=false` (or the service just being
unreachable) makes log parsing skip this step gracefully. Nothing else
breaks; you just won't get `anomalous_pattern` threats.

## API

```
GET  /health          -> { status: "ok" }
POST /mine             { lines: string[] }
                       -> { lineClusters: number[], clusters: [{clusterId, template, size}], truncated: bool }
```

Stateless per request — each call gets a fresh in-memory Drain3 miner
scoped to that one log's lines, not persistent across logs or requests.
Cross-log/cross-user persistent state (so a template common in your
history but suddenly appearing once elsewhere reads as more anomalous)
is a natural future extension, not implemented here.
