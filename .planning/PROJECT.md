# Four Pillars of Destiny (Bazi) Web App

## What This Is
A bilingual web application (English & Traditional Chinese) that lets users input their birth date, time, and city to generate a beautifully styled destiny chart. The chart displays ten cards covering day master, five-element balance, lucky elements, ten deity breakdown, luck cycles, special stars, life guidance, ideal partner traits, plus AI-powered deep readings via streaming Claude API.

## Core Value
Accurate, aesthetically pleasing Bazi charts with personalized AI readings must work for every user, regardless of language.

## Requirements

### Validated

- ✓ DEPLOY-01: Front-end is pure HTML, CSS, and JavaScript (no framework) — v1.0
- ✓ DEPLOY-02: Serverless function handles AI proxy on Vercel — v1.0
- ✓ DEPLOY-03: Application deploys successfully to Vercel — v1.0
- ✓ DEPLOY-04: All features work in production environment — v1.0
- ✓ CHART-01: User can input birth date (year, month, day) — v1.0
- ✓ CHART-02: User can input birth time (hour, minute) — v1.0
- ✓ CHART-03: User can input birth city via text search — v1.0
- ✓ CHART-04: System resolves city to timezone and coordinates via geocoding API — v1.0
- ✓ CHART-05: System calculates Four Pillars chart using existing Bazi JS library — v1.0
- ✓ CHART-06: System displays 10 cards — v1.0
- ✓ AI-01: User can view AI-powered narrative intro for their chart — v1.0
- ✓ AI-02: User can view structured insights (career, relationships, health, wealth) — v1.0
- ✓ AI-03: User can click any of the 10 cards to expand and get deeper AI reading — v1.0
- ✓ AI-04: Vercel Serverless Function proxies requests to Claude API — v1.0
- ✓ AI-05: AI readings are generated based on user's specific chart data — v1.0
- ✓ UI-01: User can toggle between English and Traditional Chinese — v1.0
- ✓ UI-02: All UI text translates when language is toggled — v1.0
- ✓ UI-03: AI readings are generated in the selected language — v1.0
- ✓ UI-04: Chart displays beautifully with responsive design — v1.0

### Active

- [ ] ENHANCE-01: User can save charts to browser local storage
- [ ] ENHANCE-02: User can share chart via unique URL
- [ ] ENHANCE-03: User can print chart as PDF
- [ ] ENHANCE-04: User can compare two charts (compatibility reading)
- [ ] ADV-01: User can ask follow-up questions about their chart
- [ ] ADV-02: System provides yearly forecast based on current luck cycle
- [ ] ADV-03: System suggests auspicious dates for major life events

### Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts | Fully free, no login needed |
| Payment integration | Fully free model |
| Mobile native app | Web-first approach; PWA works well |
| Historical chart database | Privacy-focused, no data storage |
| Social features | Focus on individual readings |
| Offline mode | Real-time AI is core value |

## Context

Shipped v1.0 with ~2,113 LOC (HTML/CSS/JS). Tech stack: pure vanilla JS, Vercel serverless, Claude API (claude-3-5-haiku-20241022), Nominatim geocoding, lunar-javascript CDN.

Production URL: https://four-pillars-khaki.vercel.app

All 17 v1 requirements verified live. Initial build took 2 days (2026-03-16 → 2026-03-18).

## Constraints
- No front-end framework — pure HTML, CSS, and JavaScript
- Serverless function must stay within Vercel free tier limits
- Must support Traditional Chinese characters and locale

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Claude API | Provides nuanced, high-quality readings | ✓ Good — streaming via native fetch, zero deps |
| Geocoding via Nominatim + timeapi.io | Free, no API key required | ✓ Good — works reliably |
| Use existing Bazi JS library | Saves development time, ensures correctness | ✓ Good — integrated cleanly |
| Fully free model | Aligns with core value of accessibility | ✓ Good — no payment integration |
| claude-3-5-haiku-20241022 | Fast and cost-effective for 600-token readings | ✓ Good — snappy streaming UX |
| SSE line buffer across chunks | Prevents partial JSON parse errors | ✓ Good — robust streaming |
| Cache guard via data-readingLoaded | Prevents duplicate fetches on re-click | ✓ Good — clean UX |
| elLabel() helper for element localisation | Centralises ZH_EL map, avoids scatter | ✓ Good — clean bilingual pattern |

---
*Last updated: 2026-03-18 after v1.0 milestone*
