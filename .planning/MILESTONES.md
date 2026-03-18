# Milestones

## v1.0 MVP (Shipped: 2026-03-18)

**Phases completed:** 4 phases, 13 plans
**Files modified:** 48 | **LOC:** ~2,113 (HTML/CSS/JS) | **Timeline:** 2 days (2026-03-16 → 2026-03-18)
**Git range:** `6455a9e` → `330a857`

**Delivered:** Bilingual Bazi chart web app with 10-card chart display, streaming Claude AI readings, EN/zh-TW language toggle, and warm cream theme — all 17 v1 requirements verified live on Vercel.

**Key accomplishments:**
1. Deployed pure HTML/CSS/JS scaffold to Vercel with serverless AI proxy at `/api/reading`
2. Built full Bazi calculation engine with true solar time, 3-stem hidden stems, and Nominatim geocoding
3. Rendered all 10 chart cards from real chart data with responsive CSS grid
4. Integrated streaming Claude AI readings (claude-3-5-haiku) with SSE, markdown rendering, and per-card lazy fetch
5. Shipped full EN/zh-TW bilingual UI with warm cream theme, language toggle, and localStorage persistence
6. Verified all 17 v1 requirements live on https://four-pillars-khaki.vercel.app

---

