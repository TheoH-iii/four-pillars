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

// ── Form Validation ─────────────────────────────────���───
function validateForm(data) {
  const year = data.year, month = data.month, day = data.day;
  const hour = data.hour, minute = data.minute, city = data.city;
  if (!year || year < 1900 || year > 2100) return t('validYear');
  if (!month || month < 1 || month > 12)   return t('validMonth');
  if (!day   || day < 1   || day > 31)     return t('validDay');
  if (hour === '' || isNaN(hour) || hour < 0 || hour > 23) return t('validHour');
  if (minute === '' || isNaN(minute) || minute < 0 || minute > 59) return t('validMinute');
  if (!city || city.trim().length < 1)     return t('validCity');
  return null;
}

// ── Screen Switching ─────────────────────────────────��──
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
  submitBtn.textContent = t('btnCalculating');

  try {
    // Geocode city (Nominatim primary, local fallback)
    const cityResult = await geocodeCity(data.city);
    if (!cityResult) {
      throw new Error(t('errorCityNotFound'));
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

    // Store chart data for card rendering
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
    errorEl.textContent = err.message || t('errorGeneric');
    errorEl.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t('btnCalculate');
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
      <button class="reveal-btn" onclick="fetchReading(this.closest('.bazi-card'), this.closest('.bazi-card').dataset.cardType)">${t('btnReveal')}</button>
    </div>
  `).join('');
}

// Helper: render a list of data rows
function dataRows(rows) {
  return rows.map(([label, value]) =>
    `<div class="data-row"><span class="data-label">${label}</span><span class="data-value">${value}</span></div>`
  ).join('');
}

// Helper: return element label in current language
function elLabel(el) {
  if (window.currentLanguage === 'zh') {
    var ZH_EL = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
    return ZH_EL[el] || el;
  }
  return ELEMENT_NAMES[el] || el;
}

// Helper: format element array using elLabel
function formatElementLabels(arr) {
  return (arr || []).map(function(el) { return elLabel(el); });
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
    container.innerHTML = '<div class="reading-error"><p>' + t('errorReadingUnavailable') + '</p><button class="retry-btn" onclick="retryReading(this)">' + t('btnRetry') + '</button></div>';
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
  const patternDisplay = window.currentLanguage === 'zh'
    ? (analysis.pattern.name + ' (' + analysis.pattern.en + ')')
    : (analysis.pattern.en + ' (' + analysis.pattern.name + ')');
  return {
    title: t('cardOverview'),
    body: dataRows([
      [t('labelPillars'), pillars],
      [t('labelPattern'), patternDisplay],
      [t('labelCity'), city.name],
      [t('labelTrueSolarTime'), `${String(tst.h).padStart(2,'0')}:${String(tst.m).padStart(2,'0')}`]
    ])
  };
}

// 2. Day Master
function buildCardDayMaster(eightChar, analysis) {
  const dayStem = eightChar.getDayGan();
  const el = STEM_ELEMENT[dayStem];
  const elName = elLabel(el);
  const polarity = dayStem ? (['甲','丙','戊','庚','壬'].includes(dayStem) ? t('polarityYang') : t('polarityYin')) : '';
  const stemDisplay = window.currentLanguage === 'zh'
    ? dayStem
    : (dayStem + (window.STEM_EN && window.STEM_EN[dayStem] ? ' · ' + window.STEM_EN[dayStem] : ''));
  return {
    title: t('cardDayMaster'),
    body: dataRows([
      [t('labelStem'), stemDisplay],
      [t('labelElement'), elName],
      [t('labelPolarity'), polarity],
      [t('labelStrength'), analysis.strength === 'strong' ? t('strengthStrong') : t('strengthWeak')]
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
    .map(([el, n]) => `${elLabel(el)} ${n > 0 ? n.toFixed(n % 1 === 0 ? 0 : 1) : '0'}`);
  return {
    title: t('cardFiveElements'),
    body: dataRows([
      [t('labelDistribution'), sorted.slice(0, 3).join(' · ')],
      [t('labelAlso'), sorted.slice(3).join(' · ')],
      [t('labelStrongest'), sorted[0].split(' ')[0]],
      [t('labelWeakest'), sorted[sorted.length - 1].split(' ')[0]]
    ])
  };
}

// 4. Lucky Elements
function buildCardLuckyElements(analysis) {
  const favorable = formatElementLabels(analysis.favorable);
  const allEls = ['wood', 'fire', 'earth', 'metal', 'water'];
  const unfavorable = allEls
    .filter(e => !(analysis.favorable || []).includes(e))
    .map(e => elLabel(e));
  return {
    title: t('cardLuckyElements'),
    body: dataRows([
      [t('labelFavorable'), favorable.join(', ') || '—'],
      [t('labelUnfavorable'), unfavorable.slice(0, 2).join(', ') || '—'],
      [t('labelBasis'), analysis.strength === 'strong' ? t('strengthStrongBasis') : t('strengthWeakBasis')]
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
    .map(([deity, count]) => `${(window.currentLanguage === 'zh' ? (DEITY_NAMES.zh && DEITY_NAMES.zh[deity]) : DEITY_NAMES.en[deity]) || deity} ×${count}`);
  return {
    title: t('cardTenDeities'),
    body: dataRows([
      [t('labelDayMaster'), dayStem],
      [t('labelDominant'), top3[0] || '—'],
      [t('labelSecondary'), top3[1] || '—'],
      [t('labelThird'), top3[2] || '—']
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
      return [gz, t('cycleFrom') + ' ' + yr];
    });
    return {
      title: t('cardLuckCycles'),
      body: dataRows([
        [t('labelCyclesBeginAge'), String(startAge)],
        ...cycleRows
      ])
    };
  } catch (e) {
    return { title: t('cardLuckCycles'), body: dataRows([[t('labelStatus'), t('cycleUnavailable')]]) };
  }
}

// 7. Special Stars
function buildCardSpecialStars(analysis) {
  const stars = analysis.stars;
  return {
    title: t('cardSpecialStars'),
    body: dataRows(
      stars.length > 0
        ? stars.map(s => [s, t('starsPresent')])
        : [[t('labelStars'), t('starsNone')]]
    )
  };
}

// 8. Life Guidance
function buildCardLifeGuidance(analysis) {
  const favorable = formatElementLabels(analysis.favorable);
  const isStrong = analysis.strength === 'strong';
  return {
    title: t('cardLifeGuidance'),
    body: dataRows([
      [t('labelChartType'), isStrong ? t('strengthStrongDesc') : t('strengthWeakDesc')],
      [t('labelEnhanceWith'), favorable.join(', ') || '—'],
      [t('labelPattern'), window.currentLanguage === 'zh' ? analysis.pattern.name : analysis.pattern.en]
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
  const partnerElName = elLabel(partnerEl) || '—';
  return {
    title: t('cardPartnerTraits'),
    body: dataRows([
      [t('labelPartnerElement'), partnerElName],
      [t('labelCompatibility'), analysis.strength === 'strong' ? t('compatGrounding') : t('compatSupportive')],
      [t('labelKeyQuality'), analysis.pattern.en.includes('Officer') ? t('qualityDisciplined') : t('qualityAdaptable')]
    ])
  };
}

// 10. AI Summary
function buildCardAISummary() {
  return {
    title: t('cardAISummary'),
    body: ''
  };
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initCityAutocomplete();
  initBackButton();
  document.getElementById('birth-form').addEventListener('submit', handleFormSubmit);
});
