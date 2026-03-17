# Phase 3: AI Integration - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up Claude-powered readings through the Vercel serverless proxy. The chart overview card gets a narrative intro and structured insights (career, relationships, health, wealth). All 10 cards get an expandable deep reading triggered by a button. AI reads from actual chart data — no generic text. Language parameter is wired now; English is the default until Phase 4 adds the toggle.

</domain>

<decisions>
## Implementation Decisions

### Card Expand UX
- Each card has an explicit button labeled "Reveal Reading" (English) / "深度解析" (Chinese)
- No mention of AI anywhere — framing is fortune teller unlocking an interpretation, not generating AI content
- Clicking the button triggers a lazy fetch and smoothly expands the card inline
- Reading appears below the existing data rows — card grows in place
- One-time reveal: button disappears after reading loads, reading stays open permanently
- No collapse/toggle — once revealed, always visible

### AI Request Strategy
- Lazy fetch: reading only fetches when user clicks the button
- Cached in memory: once fetched, the reading is stored so re-clicking doesn't re-fetch
- On API failure: show a friendly error message inside the card with a retry button
- No pre-fetching on chart load

### Loading & Streaming
- Stream tokens as they arrive (SSE or chunked response from serverless function)
- Text renders as markdown progressively — bold, line breaks, bullet points appear as they stream
- Blinking cursor or animated ellipsis at the end of streaming text while more is coming
- When streaming completes, cursor disappears and reading is final

### Prompt Design
- Single system prompt establishing persona as a master Bazi astrologer — never mentions AI or Claude
- Persona: human fortune teller giving an interpretation, not an AI generating content
- Card-specific context passed in the user message (card type + relevant chart data slice)
- Each request includes: compact chart summary (pillars, day master, strength, pattern, favorable elements) + card-specific data
- Language parameter wired into every request now; defaults to English; Phase 4 will pass the user's selected language
- Reading length: medium — approximately one paragraph per section

### Claude's Discretion
- Exact system prompt wording and tone calibration
- How to structure the compact chart summary object sent to the API
- Markdown formatting conventions within readings (headers, bold, bullets)
- Blinking cursor implementation (CSS animation vs JS interval)
- Exact SSE/streaming implementation on the serverless function side

</decisions>

<specifics>
## Specific Ideas

- Button label intentionally avoids "AI" — "Reveal Reading" / "深度解析" feels like unlocking a fortune teller's interpretation
- Readings should never break the fourth wall — no "As an AI..." or "Based on your data..." phrasing
- Streaming text appearing word-by-word reinforces the mystical, live-reading feel

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `api/reading.js`: stub at `/api/reading` — flesh out to accept POST with chart data + card type + language, call Claude API, stream response back
- `window.currentChart`: holds full chart object (`eightChar`, `yun`, `analysis`, `input`, `city`, `tst`) — source of truth for all prompt data
- `renderCards()` + `buildCard*()` pattern: each card returns `{ title, body }` — expand pattern to include a reveal button and a reading container div
- `dataRows()` helper: existing utility for structured data rows in cards

### Established Patterns
- Pure JS globals, no ES modules — all new code uses global functions/variables
- Flat file structure at root — any new JS helpers go in `app.js` or a new root-level file
- Cards rendered via `container.innerHTML` — AI reading injection will target individual card DOM nodes after initial render

### Integration Points
- `renderCards()` in `app.js`: add reveal button + empty reading container to each card's HTML output
- `api/reading.js`: replace stub with real Claude API call, add streaming support
- `window.currentChart`: extract compact summary + card-specific slice here before sending to API
- `vercel.json`: may need `maxDuration` bump for streaming responses

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-ai-integration*
*Context gathered: 2026-03-17*
