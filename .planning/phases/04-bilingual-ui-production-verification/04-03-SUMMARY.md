---
phase: 04-bilingual-ui-production-verification
plan: "03"
subsystem: frontend
tags: [i18n, app.js, bilingual, t()]
dependency_graph:
  requires: [04-01]
  provides: [UI-01, UI-02, UI-03]
  affects: [app.js]
tech_stack:
  added: []
  patterns: [t() i18n calls, elLabel() helper, formatElementLabels(), bilingual pattern display, STEM_EN descriptor in EN mode, DEITY_NAMES.zh in zh mode]
key_files:
  created: []
  modified:
    - app.js
decisions:
  - elLabel() helper centralises element name localisation — avoids scattering ZH_EL map across multiple card builders
  - formatElementLabels() replaces formatElementNames() for display-only paths; formatElementNames() retained for API summary (always English)
  - buildCardLuckyElements unfavorable list rebuilt from raw element keys filtered against analysis.favorable, then mapped through elLabel() — avoids stale English-only allEls array
  - partnerElName uses elLabel(partnerEl) so partner element also localises in zh mode
metrics:
  duration: 4min
  completed_date: "2026-03-18"
  tasks_completed: 1
  files_modified: 1
requirements: [UI-01, UI-02, UI-03]
---

# Phase 4 Plan 3: i18n Wiring in app.js Summary

All hardcoded English UI strings in app.js replaced with t() calls. Language toggle now produces instant full re-render of all card titles, data labels, validation messages, button text, and dynamic value strings. AI readings continue to be requested in the currently selected language via `window.currentLanguage` in the fetch body.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace all hardcoded UI strings in app.js with t() calls | 9f3069c | app.js |

## Decisions Made

- `elLabel()` helper centralises element name localisation — avoids scattering the ZH_EL map across multiple card builders
- `formatElementLabels()` replaces `formatElementNames()` for display-only paths; `formatElementNames()` retained in `buildChartSummary()` (always English for API)
- `buildCardLuckyElements` unfavorable list rebuilt from raw element keys filtered against `analysis.favorable`, then mapped through `elLabel()` — avoids stale English-only array
- `partnerElName` uses `elLabel(partnerEl)` so partner element also localises in zh mode

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed buildCardLuckyElements unfavorable filter**
- Found during: Task 1
- Issue: Original code filtered against English display names (`['Wood','Fire',...]`) but `analysis.favorable` contains lowercase keys (`['wood','fire',...]`), so the filter always produced an empty unfavorable list
- Fix: Rebuilt unfavorable from lowercase element keys filtered against `analysis.favorable`, then mapped through `elLabel()`
- Files modified: app.js
- Commit: 9f3069c

## Self-Check: PASSED

- app.js: FOUND
- 04-03-SUMMARY.md: FOUND
- commit 9f3069c: FOUND
