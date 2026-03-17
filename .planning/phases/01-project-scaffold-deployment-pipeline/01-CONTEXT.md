# Phase 1: Project Scaffold & Deployment Pipeline - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up the Vercel project structure, create the file skeleton, and get the serverless proxy function reachable at /api/reading. No app logic yet — just the scaffold that deploys cleanly.

</domain>

<decisions>
## Implementation Decisions

### Project File Structure
- Flat root: `index.html`, `style.css` at root level
- JS files split by concern at root: `bazi-engine.js` (calculation engine), `solar.js` (true solar time), `cities.js` (city database), `i18n.js` (EN/zh-TW translations), `app.js` (main entry + UI)
- Serverless function at `/api/reading.js`

### Serverless Function Shape
- Path: `/api/reading`
- Accepts: GET (health check) and POST (actual use)
- Phase 1 response: JSON health check stub — `{ status: 'ok', message: 'reading endpoint ready' }`
- No real Claude API call in Phase 1 — stub only

### Vercel Config
- Environment variable name: `ANTHROPIC_API_KEY`
- Function timeout: 30 seconds
- No custom routes — Vercel auto-routes `/api/*` to functions, serves `index.html` at root

### Claude's Discretion
- Exact content of index.html placeholder (minimal HTML boilerplate is fine)
- style.css initial content (can be empty or minimal reset)
- Stub JS file contents (empty or single comment is fine)

</decisions>

<specifics>
## Specific Ideas

- No specific references — this is pure scaffold, aesthetics come in later phases

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project

### Established Patterns
- None yet — this phase establishes the baseline

### Integration Points
- `/api/reading` is the contract point between front-end and serverless function — all future AI calls route here

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-scaffold-deployment-pipeline*
*Context gathered: 2026-03-17*
