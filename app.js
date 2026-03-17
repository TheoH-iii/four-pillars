// app.js — Main entry point

// ── State ──────────────────────────────────────────────
let selectedCity = null; // { name, lat, lng, timezone }

// ── City Autocomplete ──────────────────────────────────
function initCityAutocomplete() {
  const input = document.getElementById('city-input');
  const list  = document.getElementById('city-suggestions');

  input.addEventListener('input', function () {
    const q = this.value.trim();
    selectedCity = null; // reset on new typing
    if (q.length < 1) { list.hidden = true; list.innerHTML = ''; return; }

    const results = searchCities(q);
    if (results.length === 0) { list.hidden = true; list.innerHTML = ''; return; }

    list.innerHTML = results.map((c, i) =>
      '<li data-index="' + i + '" data-name="' + c.en + '" data-lng="' + c.lng + '">' + c.name + '</li>'
    ).join('');
    list.hidden = false;
  });

  list.addEventListener('click', function (e) {
    const li = e.target.closest('li');
    if (!li) return;
    const name = li.dataset.name;
    const lng  = parseFloat(li.dataset.lng);
    // For local city hits, set a placeholder city object; geocodeCity will enrich it
    selectedCity = { name: name, lat: null, lng: lng, timezone: null };
    input.value = name;
    list.hidden = true;
    list.innerHTML = '';
  });

  // Hide suggestions on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.city-wrapper')) {
      list.hidden = true;
    }
  });
}

// ── Form Validation ─────────────────────────────────���──
function validateForm(data) {
  const year = data.year, month = data.month, day = data.day;
  const hour = data.hour, minute = data.minute, city = data.city;
  if (!year || year < 1900 || year > 2100) return 'Year must be between 1900 and 2100';
  if (!month || month < 1 || month > 12)   return 'Month must be between 1 and 12';
  if (!day   || day < 1   || day > 31)     return 'Day must be between 1 and 31';
  if (hour === '' || isNaN(hour) || hour < 0 || hour > 23) return 'Hour must be between 0 and 23';
  if (minute === '' || isNaN(minute) || minute < 0 || minute > 59) return 'Minute must be between 0 and 59';
  if (!city || city.trim().length < 1)     return 'Please enter a birth city';
  return null;
}

// ── Screen Switching ���──────────────────────────────────
function showScreen(id) {
  document.getElementById('form-screen').hidden  = (id !== 'form-screen');
  document.getElementById('chart-screen').hidden = (id !== 'chart-screen');
}

// ── Form Submit ────────────────────────────────────────
async function handleFormSubmit(e) {
  e.preventDefault();

  const errorEl  = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  const data = {
    year:   parseInt(document.getElementById('year').value,   10),
    month:  parseInt(document.getElementById('month').value,  10),
    day:    parseInt(document.getElementById('day').value,    10),
    hour:   parseInt(document.getElementById('hour').value,   10),
    minute: parseInt(document.getElementById('minute').value, 10),
    city:   document.getElementById('city-input').value.trim(),
    gender: parseInt(document.getElementById('gender').value, 10)
  };

  const validationError = validateForm(data);
  if (validationError) {
    errorEl.textContent = validationError;
    errorEl.hidden = false;
    return;
  }
  errorEl.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Calculating...';

  try {
    // Geocode city (Nominatim primary, local fallback)
    const cityResult = await geocodeCity(data.city);
    if (!cityResult) {
      throw new Error('Could not resolve city. Please try a different city name.');
    }
    selectedCity = cityResult;

    // Convert to true solar time using resolved longitude
    const tst = toTrueSolarTime(
      data.year, data.month, data.day,
      data.hour, data.minute,
      selectedCity.lng
    );

    // Build lunar-javascript Solar object using true solar date/time
    const shichenHour = getShichenHour(tst.h, tst.m);
    const solar = Solar.fromYmdHms(
      tst.date.year, tst.date.month, tst.date.day,
      shichenHour, 0, 0
    );
    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar();
    const yun = eightChar.getYun(data.gender);

    // Run Bazi analysis
    const analysis = analyzeBazi(eightChar, yun, data.gender);

    // Store chart data for card rendering (Plan 03 will use this)
    window.currentChart = {
      input: data,
      city: selectedCity,
      tst: tst,
      eightChar: eightChar,
      yun: yun,
      analysis: analysis
    };

    showScreen('chart-screen');
    renderCards(window.currentChart);

  } catch (err) {
    errorEl.textContent = err.message || 'An error occurred. Please try again.';
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Calculate Chart';
  }
}

// ── Back Button ────────────────────────────────────────
function initBackButton() {
  document.getElementById('back-btn').addEventListener('click', function () {
    showScreen('form-screen');
  });
}

// ── Card Rendering ─────────────────────────────────────

function renderCards(chart) {
  const container = document.getElementById('cards-container');
  const { eightChar, yun, analysis, input, city, tst } = chart;

  const cards = [
    buildCardChartOverview(eightChar, analysis, input, city, tst),
    buildCardDayMaster(eightChar, analysis),
    buildCardFiveElements(eightChar, analysis),
    buildCardLuckyElements(analysis),
    buildCardTenDeities(eightChar, analysis),
    buildCardLuckCycles(yun),
    buildCardSpecialStars(analysis),
    buildCardLifeGuidance(analysis),
    buildCardPartnerTraits(eightChar, analysis),
    buildCardAISummary()
  ];

  const cardTypes = ['overview','dayMaster','fiveElements','luckyElements','tenDeities','luckCycles','specialStars','lifeGuidance','partnerTraits','aiSummary'];

  container.innerHTML = cards.map((c, i) => `
    <div class="bazi-card" data-card-type="${cardTypes[i]}">
      <h2 class="card-title">${c.title}</h2>
      <div class="card-body">${c.body}</div>
      <div class="reading-container"></div>
      <button class="reveal-btn" onclick="fetchReading(this.closest('.bazi-card'), this.closest('.bazi-card').dataset.cardType)">Reveal Reading</button>
    </div>
  `).join('');
}

// Helper: render a list of data rows
function dataRows(rows) {
  return rows.map(([label, value]) =>
    `<div class="data-row"><span class="data-label">${label}</span><span class="data-value">${value}</span></div>`
  ).join('');
}

// ── AI Reading ─────────────────────────────────────────

// Minimal markdown renderer: bold, paragraphs, bullet lists
function renderMarkdown(text) {
  // Bold
  let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Split into lines for list detection
  const lines = html.split('\n');
  const out = [];
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBullet = /^[-•]\s/.test(line);
    if (isBullet) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + line.replace(/^[-•]\s/, '') + '</li>');
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(line);
    }
  }
  if (inList) out.push('</ul>');
  // Paragraphs: join and split on double newline
  const joined = out.join('\n');
  const paras = joined.split(/\n\n+/);
  return '<p>' + paras.map(p => p.replace(/\n/g, ' ')).join('</p><p>') + '</p>';
}

// Build compact chart summary for API request
function buildChartSummary(chart, cardType) {
  const { eightChar, yun, analysis } = chart;
  const stems   = [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()];
  const branches = [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), eightChar.getTimeZhi()];
  const pillars = stems.map((s, i) => s + branches[i]).join(' · ');
  const dayMaster = eightChar.getDayGan();
  const dayMasterElement = ELEMENT_NAMES[STEM_ELEMENT[dayMaster]] || STEM_ELEMENT[dayMaster];
  const favorableElements = (analysis.favorable || []).map(el => ELEMENT_NAMES[el] || el);

  let cardData = {};
  if (cardType === 'overview') {
    const dist = getDeityDistribution(analysis.tenDeities);
    const top3 = Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([deity, count]) => ({ deity: DEITY_NAMES.en[deity] || deity, count }));
    cardData = { stars: analysis.stars, tenDeities: top3 };
  } else if (cardType === 'fiveElements') {
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    stems.forEach(s => { if (STEM_ELEMENT[s]) counts[STEM_ELEMENT[s]]++; });
    branches.forEach(b => {
      const hidden = BRANCH_HIDDEN_STEMS[b] || [];
      hidden.forEach(hs => { if (STEM_ELEMENT[hs]) counts[STEM_ELEMENT[hs]] += 0.5; });
    });
    cardData = { distribution: counts };
  } else if (cardType === 'tenDeities') {
    const dist = getDeityDistribution(analysis.tenDeities);
    const top3 = Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([deity, count]) => ({ deity: DEITY_NAMES.en[deity] || deity, count }));
    cardData = { top3 };
  } else if (cardType === 'luckCycles') {
    try {
      const startAge = yun.getStartYear ? yun.getStartYear() : null;
      const daYuns = yun.getDaYun ? yun.getDaYun().slice(0, 3) : [];
      const cycles = daYuns.map(dy => ({
        ganZhi: dy.getGanZhi ? dy.getGanZhi() : '?',
        startYear: dy.getStartYear ? dy.getStartYear() : '?'
      }));
      cardData = { startAge, cycles };
    } catch (e) {
      cardData = {};
    }
  } else if (cardType === 'partnerTraits') {
    const isYang = ['甲','丙','戊','庚','壬'].includes(dayMaster);
    const dayEl = STEM_ELEMENT[dayMaster];
    const partnerEl = isYang
      ? Object.keys(ELEMENT_CONTROLS).find(k => ELEMENT_CONTROLS[k] === dayEl)
      : ELEMENT_CONTROLS[dayEl];
    cardData = { partnerElement: ELEMENT_NAMES[partnerEl] || partnerEl || '—' };
  }

  return {
    pillars,
    dayMaster,
    dayMasterElement,
    strength: analysis.strength,
    pattern: analysis.pattern.en,
    favorableElements,
    cardData
  };
}

// Show error state inside a card's reading container
function showReadingError(cardEl) {
  const container = cardEl.querySelector('.reading-container');
  if (container) {
    container.innerHTML = '<div class="reading-error"><p>Reading unavailable. Please try again.</p><button class="retry-btn" onclick="retryReading(this)">Retry</button></div>';
  }
  cardEl.dataset.readingLoaded = 'error';
}

// Retry a failed reading
function retryReading(retryBtn) {
  const cardEl = retryBtn.closest('.bazi-card');
  if (!cardEl) return;
  cardEl.dataset.readingLoaded = '';
  const btn = cardEl.querySelector('.reveal-btn');
  if (btn) btn.style.display = '';
  const container = cardEl.querySelector('.reading-container');
  if (container) container.innerHTML = '';
  fetchReading(cardEl, cardEl.dataset.cardType);
}

// Fetch and stream an AI reading into a card
async function fetchReading(cardEl, cardType) {
  if (cardEl.dataset.readingLoaded === 'true') return;

  const btn = cardEl.querySelector('.reveal-btn');
  if (btn) btn.style.display = 'none';

  let container = cardEl.querySelector('.reading-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'reading-container';
    cardEl.appendChild(container);
  }
  container.innerHTML = '<span class="reading-cursor"></span>';
  cardEl.dataset.readingLoaded = 'loading';

  const chartSummary = buildChartSummary(window.currentChart, cardType);

  try {
    const res = await fetch('/api/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartSummary, cardType, language: window.currentLanguage || 'en' })
    });

    if (!res.ok) { showReadingError(cardEl); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete last line
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') {
          const cursor = container.querySelector('.reading-cursor');
          if (cursor) cursor.remove();
          cardEl.dataset.readingLoaded = 'true';
          return;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.error) { showReadingError(cardEl); return; }
          if (parsed.token) {
            accumulated += parsed.token;
            container.innerHTML = renderMarkdown(accumulated) + '<span class="reading-cursor"></span>';
          }
        } catch (e) {
          // ignore malformed JSON lines
        }
      }
    }
    // Stream ended without [DONE]
    const cursor = container.querySelector('.reading-cursor');
    if (cursor) cursor.remove();
    if (cardEl.dataset.readingLoaded !== 'true') {
      cardEl.dataset.readingLoaded = 'true';
    }
  } catch (e) {
    showReadingError(cardEl);
  }
}

// 1. Chart Overview
function buildCardChartOverview(eightChar, analysis, input, city, tst) {
  const stems   = [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()];
  const branches = [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), eightChar.getTimeZhi()];
  const pillars = stems.map((s, i) => `${s}${branches[i]}`).join(' · ');
  return {
    title: 'Chart Overview',
    body: dataRows([
      ['Pillars', pillars],
      ['Pattern', `${analysis.pattern.en} (${analysis.pattern.name})`],
      ['City', city.name],
      ['True Solar Time', `${String(tst.h).padStart(2,'0')}:${String(tst.m).padStart(2,'0')}`]
    ])
  };
}

// 2. Day Master
function buildCardDayMaster(eightChar, analysis) {
  const dayStem = eightChar.getDayGan();
  const el = STEM_ELEMENT[dayStem];
  const elName = ELEMENT_NAMES[el] || el;
  const polarity = dayStem ? (['甲','丙','戊','庚','壬'].includes(dayStem) ? 'Yang' : 'Yin') : '';
  return {
    title: 'Day Master',
    body: dataRows([
      ['Stem', dayStem],
      ['Element', elName],
      ['Polarity', polarity],
      ['Strength', analysis.strength === 'strong' ? 'Strong (身强)' : 'Weak (身弱)']
    ])
  };
}

// 3. Five Elements Balance
function buildCardFiveElements(eightChar, analysis) {
  const stems   = [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()];
  const branches = [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), eightChar.getTimeZhi()];
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  stems.forEach(s => { if (STEM_ELEMENT[s]) counts[STEM_ELEMENT[s]]++; });
  branches.forEach(b => {
    const hidden = BRANCH_HIDDEN_STEMS[b] || [];
    hidden.forEach(hs => { if (STEM_ELEMENT[hs]) counts[STEM_ELEMENT[hs]] += 0.5; });
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([el, n]) => `${ELEMENT_NAMES[el]} ${n > 0 ? n.toFixed(n % 1 === 0 ? 0 : 1) : '0'}`);
  return {
    title: 'Five Elements Balance',
    body: dataRows([
      ['Distribution', sorted.slice(0, 3).join(' · ')],
      ['Also', sorted.slice(3).join(' · ')],
      ['Strongest', sorted[0].split(' ')[0]],
      ['Weakest', sorted[sorted.length - 1].split(' ')[0]]
    ])
  };
}

// 4. Lucky Elements
function buildCardLuckyElements(analysis) {
  const favorable = formatElementNames(analysis.favorable);
  const allEls = ['Wood','Fire','Earth','Metal','Water'];
  const unfavorable = allEls.filter(e => !favorable.includes(e));
  return {
    title: 'Lucky Elements',
    body: dataRows([
      ['Favorable', favorable.join(', ') || '—'],
      ['Unfavorable', unfavorable.slice(0, 2).join(', ') || '—'],
      ['Basis', analysis.strength === 'strong' ? 'Strong chart — needs control' : 'Weak chart — needs support']
    ])
  };
}

// 5. Ten Deity Breakdown
function buildCardTenDeities(eightChar, analysis) {
  const dist = getDeityDistribution(analysis.tenDeities);
  const dayStem = eightChar.getDayGan();
  const top3 = Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([deity, count]) => `${DEITY_NAMES.en[deity] || deity} ×${count}`);
  return {
    title: 'Ten Deity Breakdown',
    body: dataRows([
      ['Day Master', dayStem],
      ['Dominant', top3[0] || '—'],
      ['Secondary', top3[1] || '—'],
      ['Third', top3[2] || '—']
    ])
  };
}

// 6. Luck Cycles
function buildCardLuckCycles(yun) {
  try {
    const startAge = yun.getStartYear ? yun.getStartYear() : '?';
    const daYuns = yun.getDaYun ? yun.getDaYun().slice(0, 3) : [];
    const cycleRows = daYuns.map(dy => {
      const gz = dy.getGanZhi ? dy.getGanZhi() : '?';
      const yr = dy.getStartYear ? dy.getStartYear() : '?';
      return [gz, `from ${yr}`];
    });
    return {
      title: 'Luck Cycles',
      body: dataRows([
        ['Cycles begin age', String(startAge)],
        ...cycleRows
      ])
    };
  } catch (e) {
    return { title: 'Luck Cycles', body: dataRows([['Status', 'Unavailable']]) };
  }
}

// 7. Special Stars
function buildCardSpecialStars(analysis) {
  const stars = analysis.stars;
  return {
    title: 'Special Stars',
    body: dataRows(
      stars.length > 0
        ? stars.map(s => [s, 'Present'])
        : [['Stars', 'None detected']]
    )
  };
}

// 8. Life Guidance
function buildCardLifeGuidance(analysis) {
  const favorable = formatElementNames(analysis.favorable);
  const isStrong = analysis.strength === 'strong';
  return {
    title: 'Life Guidance',
    body: dataRows([
      ['Chart Type', isStrong ? 'Strong — assertive, self-reliant' : 'Weak — collaborative, adaptive'],
      ['Enhance with', favorable.join(', ') || '—'],
      ['Pattern', analysis.pattern.en]
    ])
  };
}

// 9. Ideal Partner Traits
function buildCardPartnerTraits(eightChar, analysis) {
  const dayStem = eightChar.getDayGan();
  const isYang = ['甲','丙','戊','庚','壬'].includes(dayStem);
  const dayEl = STEM_ELEMENT[dayStem];
  const partnerEl = isYang
    ? Object.keys(ELEMENT_CONTROLS).find(k => ELEMENT_CONTROLS[k] === dayEl)
    : ELEMENT_CONTROLS[dayEl];
  const partnerElName = ELEMENT_NAMES[partnerEl] || '—';
  return {
    title: 'Ideal Partner Traits',
    body: dataRows([
      ['Partner element', partnerElName],
      ['Compatibility', analysis.strength === 'strong' ? 'Grounding, steady' : 'Supportive, nurturing'],
      ['Key quality', analysis.pattern.en.includes('Officer') ? 'Disciplined, structured' : 'Adaptable, resourceful']
    ])
  };
}

// 10. AI Summary
function buildCardAISummary() {
  return {
    title: 'AI Summary',
    body: ''
  };
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initCityAutocomplete();
  initBackButton();
  document.getElementById('birth-form').addEventListener('submit', handleFormSubmit);
});
