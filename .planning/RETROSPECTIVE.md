# Retrospective: Four Pillars of Destiny (Bazi) Web App

---

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-18
**Phases:** 4 | **Plans:** 13 | **Timeline:** 2 days

### What Was Built

- Deployed pure HTML/CSS/JS scaffold to Vercel with serverless AI proxy at `/api/reading`
- Built full Bazi calculation engine with true solar time, 3-stem hidden stems, and Nominatim geocoding
- Rendered all 10 chart cards from real chart data with responsive CSS grid
- Integrated streaming Claude AI readings (claude-3-5-haiku) with SSE, markdown rendering, and per-card lazy fetch
- Shipped full EN/zh-TW bilingual UI with warm cream theme, language toggle, and localStorage persistence
- Verified all 17 v1 requirements live on https://four-pillars-khaki.vercel.app

### What Worked

- Card builder pattern (`buildCard*()` returns `{ title, body }`) kept rendering logic clean and composable
- Native fetch for SSE streaming — zero dependencies, no SDK overhead, worked perfectly on Vercel Node 18
- Splitting i18n into a dedicated `i18n.js` with `t()` helper made bilingual wiring systematic
- `elLabel()` helper centralised element localisation cleanly — one place to change, all cards benefit
- Incremental gap closure (04-05) as a discrete plan kept the main phase clean

### What Was Inefficient

- Form translation keys were orphaned until a gap-closure plan — could have been caught earlier by auditing i18n key coverage before marking Phase 4 complete
- `buildCardLuckyElements` unfavorable filter bug (case mismatch with `analysis.favorable`) slipped through to Phase 4 — a unit test on the filter logic would have caught it in Phase 2

### Patterns Established

- SSE line buffer across stream chunks to prevent partial JSON parse errors at chunk boundaries
- Cache guard via `data-readingLoaded` attribute to prevent duplicate AI fetches on re-click
- `formatElementNames()` always English for API prompts; `formatElementLabels()` / `elLabel()` for display — keeps AI context language-neutral
- Inline init script after `app.js` to restore persisted language before first render

### Key Lessons

- Audit i18n key coverage before closing a bilingual phase — orphaned keys are easy to miss
- Keep API prompt construction (chart summary) always in English regardless of UI language; only the instruction to Claude should specify output language
- Zero-dependency serverless functions are worth the extra boilerplate — no cold-start penalty from SDK loading

### Cost Observations

- Model: claude-3-5-haiku-20241022 for all AI readings
- Sessions: ~6 sessions across 2 days
- Notable: Haiku's speed made streaming feel instant; 600-token limit kept costs negligible

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Days | LOC  | Requirements |
|-----------|--------|-------|------|------|--------------|
| v1.0 MVP  | 4      | 13    | 2    | 2113 | 17/17        |
