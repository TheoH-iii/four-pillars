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

// ── renderCards placeholder (implemented in Plan 03) ───
function renderCards(chart) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '<p>Chart calculated. Cards rendering coming soon.</p>';
}

// ── Init ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initCityAutocomplete();
  initBackButton();
  document.getElementById('birth-form').addEventListener('submit', handleFormSubmit);
});
