# Deploying DryRun

The app is a static site — no server, no database, no environment variables.
That makes deployment simple, but there are **two settings that are not
optional**, and the site is subtly broken without them.

---

## Vercel

### 1. Import the repository — the defaults are correct

This repository's root **is** the app: `package.json`, `vite.config.js` and
`vercel.json` all sit at the top level. So leave **Root Directory** alone.

> Do **not** set Root Directory to `frontend`. There is no `frontend/` folder
> inside the repository — that is just the name of the folder on your machine.

Everything else is already configured in `vercel.json`, which Vercel reads
automatically:

| Setting | Value | Why |
| --- | --- | --- |
| Framework | Vite | detected |
| Build command | `npm run build` | also copies Python's runtime into place |
| Output directory | `dist` | |
| Node version | 20.19+ | pinned by `engines` in `package.json` |

### 2. Check the security headers actually applied

`vercel.json` sends two different Content Security Policies, and the second one
is what lets the dry run engine work at all:

- **the site** — `script-src 'self'`, no inline scripts, no eval
- **`/workers/*`** — `script-src 'self' 'unsafe-eval'` so it may compile your
  code, and `connect-src 'self'` so it can fetch Python's runtime and reach
  nothing else

**After your first deploy, open the site, press Dry Run, and look at the
browser console.** If you see a Content Security Policy error mentioning
`unsafe-eval`, the `/workers/*` rule is not being applied and nothing will run.
That is the single most likely thing to go wrong.

---

## What gets uploaded

About **23 MB**, of which **13 MB is Python**.

Pyodide is real CPython compiled to WebAssembly. It is copied into
`public/pyodide/` by `npm run sync:pyodide`, which the build runs for you, and
it is **fetched only when somebody actually runs Python** — never by visitors
who stay in JavaScript.

⚠️ **Worth watching on a free plan.** Every first-time Python user pulls roughly
6 MB compressed. Vercel's Hobby tier includes 100 GB of bandwidth a month, so
that is around 16,000 first-time Python runs before it matters. The files are
cached for 30 days, so repeat visits cost nothing. If it ever becomes a
problem, serving `/pyodide/` from a CDN bucket is the usual fix.

---

## Deploying somewhere else

`public/_headers` carries the same rules in the format **Cloudflare
Pages** and **Netlify** read. Vercel ignores that file; those two ignore
`vercel.json`.

**If you change a policy, change it in both.** They are checked to be identical
today. Getting the `/workers/*` rule wrong on either host means the dry run
engine silently stops working in production while everything else looks fine.

For any other host, two things are required:

1. **Rewrite every unmatched path to `/index.html`** — otherwise refreshing on
   `/problems` returns 404. Real files must still be served as themselves.
2. **Serve `/workers/*` with its own CSP** as above.

---

## Before you deploy

```bash
npm run check:engine     # 74 checks over the JavaScript engine
npm run check:python     # 25 checks over the Python engine
npm run check:problems   # all 150 solutions run and give the right answer
npm run lint
npm run build
```

All five pass on the current commit.
