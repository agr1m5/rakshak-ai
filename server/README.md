# Rakshak — server

Express API for Rakshak, an AI cybersecurity assistant.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Server boots on `http://localhost:5000`. Verify it's alive:

```bash
curl http://localhost:5000/api/health
```

## Structure

```
config/      env loading, (later) DB connection
controllers/ thin request handlers — parse req, call services, shape res
routes/      route tables, one file per resource, aggregated in routes/index.js
middleware/  errorHandler, notFound, (later) auth, validation
services/    business logic — ai/, logParser/, threatIntel/, reportGenerator/
models/      Mongoose schemas (Step 4)
utils/       logger, asyncHandler, ApiError
uploads/     multer upload destination (gitignored)
app.js       Express app config — middleware + routes, no listen()
server.js    boot entry point — calls app.listen()
```

`app.js` and `server.js` are split on purpose: `app.js` can be imported directly
by integration tests (e.g. supertest) without binding a real port.
