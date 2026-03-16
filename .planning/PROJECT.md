# Four Pillars of Destiny (Bazi) Web App

## What This Is
A bilingual web application (English & Traditional Chinese) that lets users input their birth date, time, and city to generate a beautifully styled destiny chart. The chart displays ten cards covering day master, five‑element balance, lucky elements, ten deity breakdown, luck cycles, special stars, life guidance, ideal partner traits, plus AI‑powered deep readings.

## Core Value
Accurate, aesthetically pleasing Bazi charts with personalized AI readings must work for every user, regardless of language.

## Requirements
* **Fixed Overview** – The ten cards present core information.
* **Expandable Cards** – Users can click a card to receive a deeper AI reading for that aspect.
* **City Lookup** – Geocoding API resolves city to timezone and coordinates.
* **AI Provider** – Claude (Anthropic API) powers the deep readings.
* **Bazi Engine** – Use an existing JavaScript Bazi library for calculations.
* **Bilingual Toggle** – UI switches between English and Traditional Chinese.
* **Deployment** – Pure HTML/CSS/JS front‑end, Vercel Serverless Function as proxy for AI calls, deployed on Vercel.
* **Fully Free** – All features, including AI readings, are freely available.

## Context
Target audience includes Western astrology enthusiasts and Traditional Chinese users seeking detailed destiny analysis. The app must handle timezone‑accurate calculations based on city input.

## Constraints
* No front‑end framework – pure HTML, CSS, and JavaScript.
* Serverless function must stay within Vercel free tier limits.
* Must support Traditional Chinese characters and locale.

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Claude API | Provides nuanced, high‑quality readings | ✅ Implemented via serverless proxy |
| Geocoding API for city lookup | Accurate timezone handling essential for Bazi calculations | ✅ Recommended service selected |
| Use existing Bazi JS library | Saves development time, ensures correctness | ✅ Integrated |
| Fully free model | Aligns with core value of accessibility | ✅ No payment integration |

---
*Last updated: 2026-03-15 after initial definition*