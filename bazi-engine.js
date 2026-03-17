/**
 * BaZi Engine — Core calculation logic
 * Based on lunar-javascript library
 */

/* ══════════════════════════════════════════════
   Ten Deities (十神) Calculation
══════════════════════════════════════════════ */

const DEITY_NAMES = {
  en: {
    '比肩': 'Rob Wealth',
    '劫财': 'Hurt Wealth',
    '食神': 'Eating God',
    '伤官': 'Hurting Officer',
    '偏财': 'Indirect Wealth',
    '正财': 'Direct Wealth',
    '七杀': 'Seven Killings',
    '正官': 'Direct Officer',
    '偏印': 'Indirect Resource',
    '正印': 'Direct Resource'
  },
  zh: {
    '比肩': '比肩',
    '劫财': '劫財',
    '食神': '食神',
    '伤官': '傷官',
    '偏财': '偏財',
    '正财': '正財',
    '七杀': '七殺',
    '正官': '正官',
    '偏印': '偏印',
    '正印': '正印'
  }
};

// Stem element mapping
const STEM_ELEMENT = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
};

// Yin/Yang polarity
const STEM_POLARITY = {
  '甲': 'yang', '乙': 'yin',
  '丙': 'yang', '丁': 'yin',
  '戊': 'yang', '己': 'yin',
  '庚': 'yang', '辛': 'yin',
  '壬': 'yang', '癸': 'yin'
};

// Five Elements relationships
const ELEMENT_GENERATES = {
  wood: 'fire',
  fire: 'earth',
  earth: 'metal',
  metal: 'water',
  water: 'wood'
};

const ELEMENT_CONTROLS = {
  wood: 'earth',
  fire: 'metal',
  earth: 'water',
  metal: 'wood',
  water: 'fire'
};

/**
 * Calculate Ten Deity for a given stem relative to Day Master
 * @param {string} dayStem - Day Master stem (日主天干)
 * @param {string} targetStem - Target stem to analyze
 * @returns {string} - Chinese deity name (比肩/劫财/食神/etc.)
 */
function calculateDeity(dayStem, targetStem) {
  if (!dayStem || !targetStem) return null;

  const dayEl = STEM_ELEMENT[dayStem];
  const dayPol = STEM_POLARITY[dayStem];
  const targetEl = STEM_ELEMENT[targetStem];
  const targetPol = STEM_POLARITY[targetStem];

  const samePol = dayPol === targetPol;

  // Same element as Day Master
  if (dayEl === targetEl) {
    return samePol ? '比肩' : '劫财';
  }

  // Day Master generates target (我生)
  if (ELEMENT_GENERATES[dayEl] === targetEl) {
    return samePol ? '食神' : '伤官';
  }

  // Day Master controls target (我克)
  if (ELEMENT_CONTROLS[dayEl] === targetEl) {
    return samePol ? '偏财' : '正财';
  }

  // Target controls Day Master (克我)
  if (ELEMENT_CONTROLS[targetEl] === dayEl) {
    return samePol ? '七杀' : '正官';
  }

  // Target generates Day Master (生我)
  if (ELEMENT_GENERATES[targetEl] === dayEl) {
    return samePol ? '偏印' : '正印';
  }

  return null;
}

/* ══════════════════════════════════════════════
   Body Strength (身强/身弱) Assessment
══════════════════════════════════════════════ */

// Branch hidden stems (地支藏干) — full table: [主气, 中气, 余气]
const BRANCH_HIDDEN_STEMS = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

/**
 * Assess body strength (simplified version)
 * @param {string} dayStem - Day Master stem
 * @param {string} monthBranch - Month branch (月支)
 * @param {Array<string>} allStems - All 4 stems [year, month, day, hour]
 * @param {Array<string>} allBranches - All 4 branches
 * @returns {'strong'|'weak'}
 */
function assessBodyStrength(dayStem, monthBranch, allStems, allBranches) {
  const dayEl = STEM_ELEMENT[dayStem];
  const generatingEl = Object.keys(ELEMENT_GENERATES).find(k => ELEMENT_GENERATES[k] === dayEl);

  let supportCount = 0;

  // Check month branch (得令) - most important
  const monthHiddenStem = BRANCH_HIDDEN_STEMS[monthBranch][0];
  const monthEl = STEM_ELEMENT[monthHiddenStem];
  if (monthEl === dayEl || monthEl === generatingEl) {
    supportCount += 2; // Month support counts double
  }

  // Count supporting stems (same element or generating element)
  allStems.filter(s => s && s !== dayStem).forEach(stem => {
    const el = STEM_ELEMENT[stem];
    if (el === dayEl || el === generatingEl) {
      supportCount++;
    }
  });

  // Count supporting branches
  allBranches.filter(b => b && b !== monthBranch).forEach(branch => {
    const hiddenStem = BRANCH_HIDDEN_STEMS[branch][0];
    const el = STEM_ELEMENT[hiddenStem];
    if (el === dayEl || el === generatingEl) {
      supportCount++;
    }
  });

  return supportCount >= 4 ? 'strong' : 'weak';
}

/* ══════════════════════════════════════════════
   Favorable Elements (喜用神)
══════════════════════════════════════════════ */

/**
 * Determine favorable elements based on body strength
 * @param {string} dayStem - Day Master stem
 * @param {'strong'|'weak'} strength - Body strength
 * @returns {Array<string>} - Array of favorable element names (max 2)
 */
function determineFavorableElements(dayStem, strength) {
  const dayEl = STEM_ELEMENT[dayStem];

  if (strength === 'strong') {
    // Strong body: favor elements that control or exhaust
    const controlledBy = Object.keys(ELEMENT_CONTROLS).find(k => ELEMENT_CONTROLS[k] === dayEl);
    const exhaustedTo = ELEMENT_GENERATES[dayEl];
    return [controlledBy, exhaustedTo].filter(Boolean);
  } else {
    // Weak body: favor elements that generate or support
    const generatedBy = Object.keys(ELEMENT_GENERATES).find(k => ELEMENT_GENERATES[k] === dayEl);
    return [generatedBy, dayEl].filter(Boolean);
  }
}

/* ═════════════════════════════��════════════════
   Chart Pattern (格局) Detection
══════════════════════════════════════════════ */

const PATTERN_NAMES = {
  '比肩': { zh: '比肩格', en: 'Rob Wealth Pattern' },
  '劫财': { zh: '劫財格', en: 'Hurt Wealth Pattern' },
  '食神': { zh: '食神格', en: 'Eating God Pattern' },
  '伤官': { zh: '傷官格', en: 'Hurting Officer Pattern' },
  '偏财': { zh: '偏財格', en: 'Indirect Wealth Pattern' },
  '正财': { zh: '正財格', en: 'Direct Wealth Pattern' },
  '七杀': { zh: '七殺格', en: 'Seven Killings Pattern' },
  '正官': { zh: '正官格', en: 'Direct Officer Pattern' },
  '偏印': { zh: '偏印格', en: 'Indirect Resource Pattern' },
  '正印': { zh: '正印格', en: 'Direct Resource Pattern' }
};

/**
 * Detect chart pattern (simplified: based on month branch hidden stem)
 * @param {string} dayStem - Day Master stem
 * @param {string} monthBranch - Month branch
 * @param {Array<string>} allStems - All heavenly stems
 * @returns {Object} - { name: '正官格', en: 'Direct Officer Pattern' }
 */
function detectPattern(dayStem, monthBranch, allStems) {
  // Get month branch's hidden stem (主气)
  const monthHiddenStem = BRANCH_HIDDEN_STEMS[monthBranch][0];

  // Check if this hidden stem appears in any of the heavenly stems (透干)
  const deity = calculateDeity(dayStem, monthHiddenStem);

  if (deity && PATTERN_NAMES[deity]) {
    return {
      name: PATTERN_NAMES[deity].zh,
      en: PATTERN_NAMES[deity].en
    };
  }

  // Default fallback
  return {
    name: '普通格',
    en: 'Balanced Pattern'
  };
}

/* ══════════════════════════════════════════════
   Special Stars (神煞)
══════════════════════════════════════════════ */

// Noble Star lookup (天乙贵人)
const NOBLE_STAR_MAP = {
  '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
  '乙': ['子', '申'], '己': ['子', '申'],
  '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳'],
  '辛': ['午', '寅']
};

// Romance Star (桃花)
const ROMANCE_STAR_MAP = {
  '寅': '卯', '午': '卯', '戌': '卯',
  '申': '酉', '子': '酉', '辰': '酉',
  '亥': '子', '卯': '子', '未': '子',
  '巳': '午', '酉': '午', '丑': '午'
};

// Traveling Star (驿马)
const TRAVELING_STAR_MAP = {
  '申': '寅', '子': '寅', '辰': '寅',
  '寅': '申', '午': '申', '戌': '申',
  '亥': '巳', '卯': '巳', '未': '巳',
  '巳': '亥', '酉': '亥', '丑': '亥'
};

// Academic Star (文昌)
const ACADEMIC_STAR_MAP = {
  '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
  '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
  '壬': '寅', '癸': '卯'
};

/**
 * Detect special stars in the chart
 * @param {string} dayStem - Day Master stem
 * @param {string} yearBranch - Year branch
 * @param {Array<string>} allBranches - All 4 branches
 * @returns {Array<string>} - Array of star names (English)
 */
function detectSpecialStars(dayStem, yearBranch, allBranches) {
  const stars = [];

  // Noble Star (based on day stem)
  const nobleBranches = NOBLE_STAR_MAP[dayStem];
  if (nobleBranches && nobleBranches.some(b => allBranches.includes(b))) {
    stars.push('Noble Star');
  }

  // Romance Star (based on year branch)
  const romanceBranch = ROMANCE_STAR_MAP[yearBranch];
  if (romanceBranch && allBranches.slice(1).includes(romanceBranch)) {
    stars.push('Romance Star');
  }

  // Traveling Star (based on year branch)
  const travelBranch = TRAVELING_STAR_MAP[yearBranch];
  if (travelBranch && allBranches.includes(travelBranch)) {
    stars.push('Traveling Star');
  }

  // Academic Star (based on day stem)
  const academicBranch = ACADEMIC_STAR_MAP[dayStem];
  if (academicBranch && allBranches.includes(academicBranch)) {
    stars.push('Academic Star');
  }

  return stars;
}

/* ══════════════════════════════════════════════
   Main Analysis Function
══════════════════════════════════════════════ */

/**
 * Analyze BaZi chart and return all calculated results
 * @param {Object} bazi - lunar-javascript EightChar object
 * @param {Object} yun - Yun object (luck cycles)
 * @param {number} gender - 1 for male, 0 for female
 * @returns {Object} - Complete analysis results
 */
function analyzeBazi(bazi, yun, gender) {
  // Extract stems and branches
  const yearStem = bazi.getYearGan();
  const monthStem = bazi.getMonthGan();
  const dayStem = bazi.getDayGan();
  const hourStem = bazi.getTimeGan();

  const yearBranch = bazi.getYearZhi();
  const monthBranch = bazi.getMonthZhi();
  const dayBranch = bazi.getDayZhi();
  const hourBranch = bazi.getTimeZhi();

  const allStems = [yearStem, monthStem, dayStem, hourStem].filter(Boolean);
  const allBranches = [yearBranch, monthBranch, dayBranch, hourBranch].filter(Boolean);

  // Calculate Ten Deities for all stems (excluding day stem itself)
  const tenDeities = {};
  [yearStem, monthStem, hourStem].filter(Boolean).forEach(stem => {
    const deity = calculateDeity(dayStem, stem);
    if (deity) {
      tenDeities[stem] = deity;
    }
  });

  // Calculate deities for all branch hidden stems (主气/中气/余气)
  allBranches.forEach(branch => {
    const hiddenStems = BRANCH_HIDDEN_STEMS[branch] || [];
    hiddenStems.forEach((hiddenStem, idx) => {
      if (hiddenStem && hiddenStem !== dayStem) {
        const deity = calculateDeity(dayStem, hiddenStem);
        if (deity) {
          const label = idx === 0 ? '主气' : idx === 1 ? '中气' : '余气';
          tenDeities[`${branch}(${hiddenStem}${label})`] = deity;
        }
      }
    });
  });

  // Assess body strength
  const strength = assessBodyStrength(dayStem, monthBranch, allStems, allBranches);

  // Determine favorable elements
  const favorableElements = determineFavorableElements(dayStem, strength);

  // Detect chart pattern
  const pattern = detectPattern(dayStem, monthBranch, allStems);

  // Detect special stars
  const stars = detectSpecialStars(dayStem, yearBranch, allBranches);

  return {
    tenDeities,
    strength,
    favorable: favorableElements,
    pattern,
    stars
  };
}

/* ══════════════════════════════════════════════
   Helper: Get deity distribution for chart
══════════════════════════════════════════════ */

/**
 * Count occurrences of each deity type
 * @param {Object} tenDeities - Result from analyzeBazi
 * @returns {Object} - { '比肩': 2, '正官': 1, ... }
 */
function getDeityDistribution(tenDeities) {
  const distribution = {};

  Object.values(tenDeities).forEach(deity => {
    distribution[deity] = (distribution[deity] || 0) + 1;
  });

  return distribution;
}

/* ══════════════════════════════════════════════
   Element name mapping
══════════════════════════════════════════════ */

const ELEMENT_NAMES = {
  wood: 'Wood',
  fire: 'Fire',
  earth: 'Earth',
  metal: 'Metal',
  water: 'Water'
};

/**
 * Convert element keys to capitalized names
 * @param {Array<string>} elements - ['wood', 'fire']
 * @returns {Array<string>} - ['Wood', 'Fire']
 */
function formatElementNames(elements) {
  return elements.map(el => ELEMENT_NAMES[el] || el);
}
