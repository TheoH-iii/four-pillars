---
phase: 02-chart-input-bazi-calculation
plan: 01
subsystem: api
tags: [bazi, solar-time, geocoding, nominatim, five-elements]

requires:
  - phase: 01-scaffold-deployment
    provides: project structure and JS file stubs

provides:
  - bazi-engine.js with full 3-stem BRANCH_HIDDEN_STEMS and analyzeBazi()
  - solar.js with toTrueSolarTime() and getShichenHour()
  - cities.js with 75-city database, searchCities(), and geocodeCity()

affects: [03-chart-display, 04-ai-reading]

tech-stack:
  added: []
  patterns:
    - "BRANCH_HIDDEN_STEMS as array [主气, 中气, 余气] — all call sites use [0] for primary stem"
    - "geocodeCity() tries Nominatim first, falls back to local CITIES array"

key-files:
  created: []
  modified:
    - bazi-engine.js
    - solar.js
    - cities.js

key-decisions:
  - "BRANCH_HIDDEN_STEMS expanded to full 3-stem arrays; call sites updated to [0] for primary stem to preserve existing logic"
  - "analyzeBazi() iterates all hidden stems per branch with 主气/中气/余气 labels in tenDeities keys"
  - "geocodeCity() uses timeapi.io for timezone resolution (free, no API key required)"

patterns-established:
  - "Hidden stem lookup: always BRANCH_HIDDEN_STEMS[branch][0] for primary, full array for iteration"
  - "Geocoding: Nominatim primary + local CITIES fallback pattern"

requirements-completed: [CHART-04, CHART-05]

duration: 15min
completed: 2026-03-17
---

# Phase 2 Plan 1: Bazi Engine Foundation Summary

**Full bazi-engine.js with 3-stem hidden stems table, true solar time conversion in solar.js, and Nominatim geocoding in cities.js**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-17T12:51:00Z
- **Completed:** 2026-03-17T13:06:21Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- solar.js: toTrueSolarTime() with longitude correction + equation of time, getShichenHour() shichen mapping
- bazi-engine.js: BRANCH_HIDDEN_STEMS expanded to full [主气, 中气, 余气] arrays, analyzeBazi() iterates all hidden stems with labels
- cities.js: 75-city CITIES array, searchCities() fuzzy search, geocodeCity() with Nominatim + local fallback

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy solar.js from v1-backup** - `29ed20f` (feat)
2. **Task 2: Copy bazi-engine.js and expand BRANCH_HIDDEN_STEMS** - `0ceec95` (feat)
3. **Task 3: Copy cities.js and add geocodeCity()** - `a4de8c1` (feat)

## Files Created/Modified
- `solar.js` - True solar time conversion with longitude correction and equation of time
- `bazi-engine.js` - Full Bazi calculation engine with expanded 3-stem hidden stems table
- `cities.js` - 75-city longitude database with Nominatim geocoding and local fallback

## Decisions Made
- BRANCH_HIDDEN_STEMS changed from string values to arrays; all existing call sites updated to use `[0]` for primary stem to preserve assessBodyStrength() and detectPattern() behavior
- analyzeBazi() now iterates all hidden stems per branch, labeling each as 主气/中气/余气 in tenDeities output keys
- Timezone resolution uses timeapi.io (free, no key) rather than a paid service

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three engine files are complete and non-stub
- bazi-engine.js exports analyzeBazi, calculateDeity, getDeityDistribution, formatElementNames
- solar.js exports toTrueSolarTime, getShichenHour
- cities.js exports searchCities, geocodeCity
- Ready for Phase 2 Plan 2: chart input form and rendering

---
*Phase: 02-chart-input-bazi-calculation*
*Completed: 2026-03-17*
