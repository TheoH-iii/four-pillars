# Phase 2: Chart Input & Bazi Calculation - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Users enter birth details (date, time, city) and receive a fully rendered 10-card Bazi chart. This phase covers the input form, geocoding, Bazi calculation, and card rendering. AI deep readings are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Bazi Engine
- Copy `bazi-engine.js` and `solar.js` directly from `/mnt/c/Users/26089/four-pillars-v1-backup/assets/js/` — these are complete and handle Ten Deities, body strength, favorable elements, pattern detection, and special stars
- The only new feature to add: full hidden stems (藏干) — expand `BRANCH_HIDDEN_STEMS` from primary stem only to all 3 hidden stems per branch (主气, 中气, 余气)
- lunar-javascript library loaded via CDN script tag in index.html (no npm, no build step)

### Input Form Layout
- Form screen → chart screen: form fills the viewport, chart replaces it entirely after submit
- No loading state between screens — instant replace
- Individual number fields for year, month, day, hour, minute (no date picker widget)
- City input: autocomplete dropdown — user types, matching suggestions appear from cities.js/Nominatim, selecting one locks in timezone + coordinates

### Geocoding
- Primary: Nominatim API (free, no key required) to resolve city to lat/lng/timezone
- Fallback: cities.js local lookup if Nominatim is unavailable or offline

### Card Layout
- Responsive grid: 2-3 cards per row on desktop, 1 per row on mobile
- All 10 cards visible at once (no tabs, no pagination)
- Each card shows: title + 2-4 key data points (structured data, no prose)
- Card order: Chart Overview → Day Master → Five Elements Balance → Lucky Elements → Ten Deity Breakdown → Luck Cycles → Special Stars → Life Guidance → Ideal Partner Traits → AI Summary Placeholder

### Calculation Data Flow
- All Bazi calculation runs client-side in bazi-engine.js
- Only AI readings (Phase 3) will hit the serverless function
- Data flow: form submit → geocode city → toTrueSolarTime() → lunar-javascript EightChar → analyzeBazi() → render 10 cards

### Claude's Discretion
- Exact CSS styling of form fields and cards (aesthetics come in later phases)
- Error handling for invalid date inputs
- Exact Nominatim API call structure and response parsing
- cities.js data format and city list contents

</decisions>

<specifics>
## Specific Ideas

- Hidden stems feature (藏干): each branch has up to 3 hidden stems. E.g. 寅 = 甲(主气), 丙(中气), 戊(余气). The current v1 `BRANCH_HIDDEN_STEMS` only stores the primary — expand to full table.
- v1-backup also has `cities.js` and `i18n.js` — check if these can be reused as-is or need adaptation

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `solar.js` (v1-backup): complete true solar time conversion + shichen mapping — copy as-is
- `bazi-engine.js` (v1-backup): complete engine with Ten Deities, body strength, favorable elements, pattern detection, special stars — copy and add hidden stems expansion
- `api/reading.js`: existing stub at `/api/reading` — Phase 3 will flesh this out

### Established Patterns
- Pure JS globals (no ES modules, no imports) — all files use global functions/variables
- lunar-javascript accessed via global `Lunar`, `Solar`, `EightChar` objects from CDN
- Flat file structure at root: `bazi-engine.js`, `solar.js`, `cities.js`, `i18n.js`, `app.js`

### Integration Points
- `index.html` loads all scripts in order: bazi-engine.js → solar.js → cities.js → i18n.js → app.js
- lunar-javascript CDN tag must be added before bazi-engine.js in script load order
- `app.js` is the main entry point — form handling, screen switching, and card rendering all live here

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-chart-input-bazi-calculation*
*Context gathered: 2026-03-17*
