/* assets/js/solar.js — True Solar Time Conversion */

/**
 * Returns the day-of-year (1-indexed)
 */
function dayOfYear(year, month, day) {
  const dpm = [31,28,31,30,31,30,31,31,30,31,30,31];
  const isLeap = (year%4===0 && year%100!==0) || year%400===0;
  if (isLeap) dpm[1] = 29;
  let doy = day;
  for (let i = 0; i < month - 1; i++) doy += dpm[i];
  return doy;
}

/**
 * Equation of Time — returns correction in minutes
 * Accuracy: ±0.5 min (sufficient for shichen determination)
 */
function equationOfTime(year, month, day) {
  const isLeap = (year%4===0 && year%100!==0) || year%400===0;
  const daysInYear = isLeap ? 366 : 365;
  const doy = dayOfYear(year, month, day);
  const B = (360 / daysInYear) * (doy - 81);  // degrees
  const Br = B * Math.PI / 180;               // radians
  return 9.87 * Math.sin(2 * Br) - 7.53 * Math.cos(Br) - 1.5 * Math.sin(Br);
}

/**
 * Convert Beijing Time → True Solar Time
 *
 * @param {number} year
 * @param {number} month  1-12
 * @param {number} day    1-31
 * @param {number} bjH    Beijing hour (0-23)
 * @param {number} bjM    Beijing minute (0-59)
 * @param {number} lng    Local longitude (degrees, east positive)
 * @returns {{ h, m, lngCorr, eot, total, date }}
 *   h/m = true solar hour/minute
 *   lngCorr = longitude correction (min, signed)
 *   eot     = equation of time (min, signed, 1 decimal)
 *   total   = total correction (min, signed, 1 decimal)
 *   date    = { year, month, day } — may differ if correction crosses midnight
 */
function toTrueSolarTime(year, month, day, bjH, bjM, lng) {
  const lngCorr = (lng - 120) * 4;                    // minutes
  const eot     = equationOfTime(year, month, day);    // minutes
  const totalMin = lngCorr + eot;

  let totalMinutes = bjH * 60 + bjM + totalMin;

  // Handle date rollover
  let dateOffset = 0;
  while (totalMinutes < 0)   { totalMinutes += 1440; dateOffset--; }
  while (totalMinutes >= 1440){ totalMinutes -= 1440; dateOffset++; }

  const tsh = Math.floor(totalMinutes / 60);
  const tsm = Math.round(totalMinutes % 60);

  // Compute adjusted date
  let adjDate = new Date(year, month - 1, day + dateOffset);
  const adjYear  = adjDate.getFullYear();
  const adjMonth = adjDate.getMonth() + 1;
  const adjDay   = adjDate.getDate();

  return {
    h: tsh,
    m: tsm,
    lngCorr: Math.round(lngCorr * 10) / 10,
    eot:     Math.round(eot     * 10) / 10,
    total:   Math.round(totalMin * 10) / 10,
    date:    { year: adjYear, month: adjMonth, day: adjDay }
  };
}

/**
 * Map true solar time (h, m) → shichen start hour (for lunar-javascript)
 * Rule: Zi Hour = 23:00–01:00 (same day, no rollover)
 */
function getShichenHour(h, m) {
  const t = h * 60 + m;
  if (t >= 23 * 60 || t < 1 * 60)  return 23;
  if (t < 3  * 60) return 1;
  if (t < 5  * 60) return 3;
  if (t < 7  * 60) return 5;
  if (t < 9  * 60) return 7;
  if (t < 11 * 60) return 9;
  if (t < 13 * 60) return 11;
  if (t < 15 * 60) return 13;
  if (t < 17 * 60) return 15;
  if (t < 19 * 60) return 17;
  if (t < 21 * 60) return 19;
  return 21;
}

/** Zero-pad helper */
function pad2(n) { return String(n).padStart(2, '0'); }
