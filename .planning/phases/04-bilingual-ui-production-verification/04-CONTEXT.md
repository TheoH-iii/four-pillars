# Phase 4: Bilingual UI & Production Verification - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Add EN/zh-TW language toggle to the existing app, translate all static UI text, pass the selected language to AI reading requests, apply the warm cream visual theme from v1-backup, and verify all 17 v1 requirements work on the live Vercel production URL. No new features — this phase polishes and verifies what's already built.

</domain>

<decisions>
## Implementation Decisions

### Language Toggle
- Fixed top-right corner, visible on both form and chart screens at all times
- Style: EN / 中文 text pill (not flags, not full names)
- Persists in localStorage — survives page refresh
- On toggle while chart is visible: instant re-render of all static UI text in the new language
- Already-revealed AI readings stay as-is (no re-fetch) — user would need to re-reveal for new language

### i18n Coverage
- All UI text translates: form labels, placeholders, button text, card titles, error messages, gender options, back button, reveal button, retry button
- Page h1 title translates: EN → "Written in the Moment of Your Birth" | zh-TW → "探尋屬於你的天命藍圖"
- Browser tab title (`<title>`) also translates with the toggle
- Bazi technical terms (Heavenly Stems, Earthly Branches) get descriptive English in EN mode: e.g. 甲 → "Yang Wood", 子 → "Rat Water"
- i18n.js (currently empty stub) is where all translation strings live
- `window.currentLanguage` already wired into AI reading requests at app.js:318 — toggle sets this value

### Visual Theme (Responsive Polish)
- Full theme swap: replace current dark theme (#0f0f1a) with warm cream palette from v1-backup
- Port full v1-backup style.css as the base, then adapt to current HTML structure
- CSS variables from v1-backup:
  - `--bg-page: #FDF7EC`, `--bg-card: #FFFFFF`
  - `--gold: #C9974A`, `--gold-light: #F0E0C0`, `--gold-border: rgba(201,151,74,0.4)`
  - Morandi element palette: `--wood: #A8C5A0`, `--fire: #E8A89C`, `--earth: #D4BC8A`, `--metal: #C8C8B0`, `--water: #96B4C8`
  - Text: `--text: #2C2213`, `--text-sub: #6B5B45`, `--text-dim: #A89880`
- Google Fonts: Playfair Display + Inter (EN), Noto Serif TC + Noto Sans TC (zh-TW) — loaded via CDN in index.html
- Font switches with language: EN uses Playfair Display / Inter, zh-TW uses Noto Serif TC / Noto Sans TC
- Responsive grid already in place (3→2→1 col) — preserve and adapt to new theme

### Production Verification
- Verify all 17 v1 requirements against live URL: https://four-pillars-khaki.vercel.app
- Verification is manual checklist — no automated smoke test in this phase
- All 17 requirements must be checked: CHART-01 through CHART-06, AI-01 through AI-05, UI-01 through UI-04, DEPLOY-01 through DEPLOY-04

### Claude's Discretion
- Exact i18n string wording for card titles and data labels (beyond the h1 strings specified above)
- Descriptive English mappings for all 10 Heavenly Stems and 12 Earthly Branches
- Exact CSS adaptations needed to fit v1-backup styles to current HTML structure
- Toggle button positioning and z-index handling

</decisions>

<specifics>
## Specific Ideas

- h1 EN: "Written in the Moment of Your Birth" | zh-TW: "探尋屬於你的天命藍圖" — exact strings, not open to interpretation
- Bazi term translation style: descriptive English (Yang Wood, Rat Water) — not pinyin, not pinyin with tones
- v1-backup CSS source: `/mnt/c/Users/26089/four-pillars-v1-backup/assets/css/style.css` — port this as the base
- v1-backup also has Google Fonts already wired — check index.html there for the exact `<link>` tags

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `i18n.js`: empty stub at root — fill with EN/zh-TW translation object, export via global `window.i18n`
- `window.currentLanguage`: already referenced in `app.js:318` for AI reading language param — toggle sets this
- `app.js:174`: "Reveal Reading" hardcoded — needs i18n lookup
- `style.css`: current dark theme — full replace with v1-backup port
- v1-backup CSS variables: complete palette already defined, ready to port

### Established Patterns
- Pure JS globals, no ES modules — i18n.js uses `window.i18n = { en: {...}, zh: {...} }` pattern
- All UI strings currently hardcoded in `app.js` and `index.html` — replace with `t('key')` helper calls
- `renderCards()` in app.js re-renders the full card grid — calling it again after toggle re-renders in new language
- Google Fonts loaded via CDN `<link>` tags in index.html — add Playfair Display, Inter, Noto Serif TC, Noto Sans TC

### Integration Points
- `index.html`: add language toggle button (fixed top-right), add Google Fonts `<link>` tags
- `i18n.js`: define full translation object + `t(key)` helper + `setLanguage(lang)` function
- `app.js`: replace all hardcoded strings with `t('key')` calls, call re-render on toggle
- `style.css`: full replace with v1-backup port adapted to current HTML selectors

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-bilingual-ui-production-verification*
*Context gathered: 2026-03-18*
