# Requirements: Four Pillars of Destiny (Bazi) Web App

**Defined:** 2026-03-16
**Core Value:** Accurate, aesthetically pleasing Bazi charts with personalized AI readings must work for every user, regardless of language.

## v1 Requirements

### Chart Generation

- [ ] **CHART-01**: User can input birth date (year, month, day)
- [ ] **CHART-02**: User can input birth time (hour, minute)
- [ ] **CHART-03**: User can input birth city via text search
- [ ] **CHART-04**: System resolves city to timezone and coordinates via geocoding API
- [ ] **CHART-05**: System calculates Four Pillars chart using existing Bazi JS library
- [ ] **CHART-06**: System displays 10 cards: day master, five elements balance, lucky elements, ten deity breakdown, luck cycles, special stars, life guidance, ideal partner traits, AI summary, chart overview

### AI Integration

- [ ] **AI-01**: User can view AI-powered narrative intro for their chart
- [ ] **AI-02**: User can view structured insights (career, relationships, health, wealth)
- [ ] **AI-03**: User can click any of the 10 cards to expand and get deeper AI reading for that aspect
- [ ] **AI-04**: Vercel Serverless Function proxies requests to Claude API
- [ ] **AI-05**: AI readings are generated based on user's specific chart data

### Bilingual UI

- [ ] **UI-01**: User can toggle between English and Traditional Chinese
- [ ] **UI-02**: All UI text translates when language is toggled
- [ ] **UI-03**: AI readings are generated in the selected language
- [ ] **UI-04**: Chart displays beautifully with responsive design

### Deployment

- [ ] **DEPLOY-01**: Front-end is pure HTML, CSS, and JavaScript (no framework)
- [ ] **DEPLOY-02**: Serverless function handles AI proxy on Vercel
- [ ] **DEPLOY-03**: Application deploys successfully to Vercel
- [ ] **DEPLOY-04**: All features work in production environment

## v2 Requirements

### Enhanced Features

- **ENHANCE-01**: User can save charts to browser local storage
- **ENHANCE-02**: User can share chart via unique URL
- **ENHANCE-03**: User can print chart as PDF
- **ENHANCE-04**: User can compare two charts (compatibility reading)

### Advanced Readings

- **ADV-01**: User can ask follow-up questions about their chart
- **ADV-02**: System provides yearly forecast based on current luck cycle
- **ADV-03**: System suggests auspicious dates for major life events

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts | Fully free, no login needed for v1 |
| Payment integration | Fully free model |
| Mobile native app | Web-first approach |
| Historical chart database | Privacy-focused, no data storage |
| Social features | Focus on individual readings |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|

**Coverage:**
- v1 requirements: 0 total
- Mapped to phases: 0
- Unmapped: 0

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 after initial definition*