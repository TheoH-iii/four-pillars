# Roadmap: Four Pillars of Destiny (Bazi) Web App

**Granularity:** Standard
**Total v1 Requirements:** 17
**Coverage:** 17/17

---

## Phases

- [x] **Phase 1: Project Scaffold & Deployment Pipeline** - Vercel project wired up, serverless function reachable, CI/CD ready
- [ ] **Phase 2: Chart Input & Bazi Calculation** - User can enter birth data, resolve city, and see a rendered 10-card chart
- [ ] **Phase 3: AI Integration** - All 10 cards expand with Claude-powered deep readings in real time
- [ ] **Phase 4: Bilingual UI & Production Verification** - Language toggle works end-to-end, app verified fully functional in production

---

## Phase Details

### Phase 1: Project Scaffold & Deployment Pipeline
**Goal**: The project structure exists, deploys to Vercel, and the serverless proxy function is reachable
**Depends on**: Nothing
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. A visitor can open the deployed Vercel URL and see a page load without errors
  2. The serverless function endpoint returns a valid response when called directly
  3. The codebase is pure HTML/CSS/JS with no front-end framework present
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Create all scaffold files (HTML, CSS, JS stubs, serverless function stub, vercel.json)
- [x] 01-02-PLAN.md — Deploy to Vercel and verify live endpoints

---

### Phase 2: Chart Input & Bazi Calculation
**Goal**: Users can enter their birth details and receive a fully rendered 10-card Bazi chart
**Depends on**: Phase 1
**Requirements**: CHART-01, CHART-02, CHART-03, CHART-04, CHART-05, CHART-06
**Success Criteria** (what must be TRUE):
  1. User can fill in birth year, month, day, hour, and minute in the input form
  2. User can type a city name and select from geocoded suggestions, resolving to timezone and coordinates
  3. After submitting, all 10 cards render on screen: day master, five elements balance, lucky elements, ten deity breakdown, luck cycles, special stars, life guidance, ideal partner traits, AI summary placeholder, chart overview
  4. Chart data is visually distinct and readable on both desktop and mobile viewports
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Copy and enhance engine files (bazi-engine.js, solar.js, cities.js) with full hidden stems and geocoding
- [ ] 02-02-PLAN.md — Build input form, city autocomplete, geocoding wiring, and screen switching
- [ ] 02-03-PLAN.md — Render all 10 Bazi cards from calculated chart data

---

### Phase 3: AI Integration
**Goal**: Every card delivers a Claude-powered deep reading, and the chart overview includes a narrative intro and structured insights
**Depends on**: Phase 2
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05
**Success Criteria** (what must be TRUE):
  1. The chart overview card displays an AI-generated narrative introduction specific to the user's chart
  2. Structured insights (career, relationships, health, wealth) are visible on the chart
  3. User can click any of the 10 cards and receive a deeper AI reading for that specific aspect
  4. AI readings visibly reflect the user's actual chart data, not generic text
  5. All AI requests route through the Vercel serverless proxy without exposing the API key client-side
**Plans**: TBD

---

### Phase 4: Bilingual UI & Production Verification
**Goal**: The full app works in both English and Traditional Chinese, and all features are verified in the live production environment
**Depends on**: Phase 3
**Requirements**: UI-01, UI-02, UI-03, UI-04, DEPLOY-04
**Success Criteria** (what must be TRUE):
  1. User can toggle between English and Traditional Chinese from any page state
  2. Every UI label, button, and static text string updates immediately when language is toggled
  3. AI readings are generated and returned in whichever language is currently selected
  4. The chart layout is visually polished and responsive across common screen sizes
  5. All 17 v1 requirements are verified working in the live Vercel production URL
**Plans**: TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffold & Deployment Pipeline | 2/2 | Complete | 2026-03-17 |
| 2. Chart Input & Bazi Calculation | 2/3 | In Progress|  |
| 3. AI Integration | 0/? | Not started | - |
| 4. Bilingual UI & Production Verification | 0/? | Not started | - |

---

*Roadmap created: 2026-03-17*
