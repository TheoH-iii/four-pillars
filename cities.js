/* assets/js/cities.js — City Longitude Database (75 cities) */

const CITIES = [
  /* China — Mainland */
  { name:"北京 Beijing",        en:"Beijing",        lng:116.4 },
  { name:"上海 Shanghai",       en:"Shanghai",       lng:121.5 },
  { name:"广州 Guangzhou",      en:"Guangzhou",      lng:113.3 },
  { name:"深圳 Shenzhen",       en:"Shenzhen",       lng:114.1 },
  { name:"成都 Chengdu",        en:"Chengdu",        lng:104.1 },
  { name:"重庆 Chongqing",      en:"Chongqing",      lng:106.5 },
  { name:"武汉 Wuhan",          en:"Wuhan",          lng:114.3 },
  { name:"西安 Xi'an",          en:"Xi'an",          lng:108.9 },
  { name:"杭州 Hangzhou",       en:"Hangzhou",       lng:120.2 },
  { name:"南京 Nanjing",        en:"Nanjing",        lng:118.8 },
  { name:"天津 Tianjin",        en:"Tianjin",        lng:117.2 },
  { name:"沈阳 Shenyang",       en:"Shenyang",       lng:123.4 },
  { name:"哈尔滨 Harbin",       en:"Harbin",         lng:126.5 },
  { name:"长春 Changchun",      en:"Changchun",      lng:125.3 },
  { name:"大连 Dalian",         en:"Dalian",         lng:121.6 },
  { name:"济南 Jinan",          en:"Jinan",          lng:117.0 },
  { name:"青岛 Qingdao",        en:"Qingdao",        lng:120.4 },
  { name:"郑州 Zhengzhou",      en:"Zhengzhou",      lng:113.6 },
  { name:"长沙 Changsha",       en:"Changsha",       lng:113.0 },
  { name:"南昌 Nanchang",       en:"Nanchang",       lng:115.9 },
  { name:"福州 Fuzhou",         en:"Fuzhou",         lng:119.3 },
  { name:"厦门 Xiamen",         en:"Xiamen",         lng:118.1 },
  { name:"昆明 Kunming",        en:"Kunming",        lng:102.7 },
  { name:"贵阳 Guiyang",        en:"Guiyang",        lng:106.7 },
  { name:"南宁 Nanning",        en:"Nanning",        lng:108.3 },
  { name:"海口 Haikou",         en:"Haikou",         lng:110.3 },
  { name:"兰州 Lanzhou",        en:"Lanzhou",        lng:103.8 },
  { name:"西宁 Xining",         en:"Xining",         lng:101.8 },
  { name:"银川 Yinchuan",       en:"Yinchuan",       lng:106.3 },
  { name:"乌鲁木齐 Urumqi",     en:"Urumqi",         lng:87.6  },
  { name:"拉萨 Lhasa",          en:"Lhasa",          lng:91.1  },
  { name:"呼和浩特 Hohhot",     en:"Hohhot",         lng:111.7 },
  { name:"太原 Taiyuan",        en:"Taiyuan",        lng:112.5 },
  { name:"石家庄 Shijiazhuang", en:"Shijiazhuang",   lng:114.5 },
  { name:"合肥 Hefei",          en:"Hefei",          lng:117.3 },
  { name:"苏州 Suzhou",         en:"Suzhou",         lng:120.6 },
  { name:"宁波 Ningbo",         en:"Ningbo",         lng:121.6 },
  { name:"温州 Wenzhou",        en:"Wenzhou",        lng:120.7 },
  { name:"东莞 Dongguan",       en:"Dongguan",       lng:113.7 },
  { name:"佛山 Foshan",         en:"Foshan",         lng:113.1 },
  { name:"珠海 Zhuhai",         en:"Zhuhai",         lng:113.6 },
  { name:"汕头 Shantou",        en:"Shantou",        lng:116.7 },
  { name:"扬州 Yangzhou",       en:"Yangzhou",       lng:119.4 },
  { name:"无锡 Wuxi",           en:"Wuxi",           lng:120.3 },
  { name:"常州 Changzhou",      en:"Changzhou",      lng:119.9 },

  /* Taiwan */
  { name:"台北 Taipei",         en:"Taipei",         lng:121.5 },
  { name:"台中 Taichung",       en:"Taichung",       lng:120.7 },
  { name:"高雄 Kaohsiung",      en:"Kaohsiung",      lng:120.3 },
  { name:"台南 Tainan",         en:"Tainan",         lng:120.2 },

  /* HK / Macau */
  { name:"香港 Hong Kong",      en:"Hong Kong",      lng:114.2 },
  { name:"澳门 Macau",          en:"Macau",          lng:113.5 },

  /* Southeast Asia */
  { name:"Singapore 新加坡",    en:"Singapore",      lng:103.8 },
  { name:"Kuala Lumpur 吉隆坡", en:"Kuala Lumpur",   lng:101.7 },
  { name:"Bangkok 曼谷",        en:"Bangkok",        lng:100.5 },
  { name:"Jakarta 雅加达",      en:"Jakarta",        lng:106.8 },
  { name:"Ho Chi Minh 胡志明",  en:"Ho Chi Minh",    lng:106.7 },
  { name:"Manila 马尼拉",       en:"Manila",         lng:121.0 },

  /* East Asia */
  { name:"Tokyo 东京",          en:"Tokyo",          lng:139.7 },
  { name:"Osaka 大阪",          en:"Osaka",          lng:135.5 },
  { name:"Seoul 首尔",          en:"Seoul",          lng:126.9 },

  /* Oceania */
  { name:"Sydney 悉尼",         en:"Sydney",         lng:151.2 },
  { name:"Melbourne 墨尔本",    en:"Melbourne",      lng:145.0 },
  { name:"Auckland 奥克兰",     en:"Auckland",       lng:174.8 },

  /* North America */
  { name:"Vancouver 温哥华",    en:"Vancouver",      lng:-123.1 },
  { name:"Toronto 多伦多",      en:"Toronto",        lng:-79.4  },
  { name:"New York 纽约",       en:"New York",       lng:-74.0  },
  { name:"Los Angeles 洛杉矶",  en:"Los Angeles",    lng:-118.2 },
  { name:"San Francisco 旧金山",en:"San Francisco",  lng:-122.4 },
  { name:"Houston 休斯顿",      en:"Houston",        lng:-95.4  },
  { name:"Chicago 芝加哥",      en:"Chicago",        lng:-87.6  },

  /* Europe */
  { name:"London 伦敦",         en:"London",         lng:-0.1  },
  { name:"Paris 巴黎",          en:"Paris",          lng:2.3   },
  { name:"Amsterdam 阿姆斯特丹",en:"Amsterdam",      lng:4.9   },
  { name:"Frankfurt 法兰克福",  en:"Frankfurt",      lng:8.7   },

  /* Middle East */
  { name:"Dubai 迪拜",          en:"Dubai",          lng:55.3  },
];

/**
 * Fuzzy search cities by name (Chinese or English)
 * @param {string} query
 * @returns {Array} top 8 matches
 */
function searchCities(query) {
  if (!query || query.trim().length < 1) return [];
  const q = query.toLowerCase().trim();
  return CITIES
    .filter(c => c.name.toLowerCase().includes(q) || c.en.toLowerCase().includes(q))
    .slice(0, 8);
}

/**
 * Geocode a city name via Nominatim, falling back to local CITIES search.
 * Returns { name, lat, lng, timezone } or null on failure.
 * @param {string} query - City name (any language)
 * @returns {Promise<{name:string, lat:number, lng:number, timezone:string}|null>}
 */
async function geocodeCity(query) {
  // Try Nominatim first
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'four-pillars-bazi-app' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        // Resolve timezone via timeapi.io (free, no key)
        const tzRes = await fetch(`https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`);
        let timezone = 'UTC';
        if (tzRes.ok) {
          const tzData = await tzRes.json();
          timezone = tzData.timeZone || 'UTC';
        }
        return { name: place.display_name.split(',')[0], lat, lng, timezone };
      }
    }
  } catch (e) {
    // Fall through to local lookup
  }

  // Fallback: local CITIES database (longitude only, assume Asia/Shanghai for Chinese cities)
  const local = searchCities(query);
  if (local.length > 0) {
    const c = local[0];
    // Estimate timezone from longitude
    const offsetHours = Math.round(c.lng / 15);
    const timezone = offsetHours >= 8 ? 'Asia/Shanghai' : 'UTC';
    return { name: c.en, lat: 0, lng: c.lng, timezone };
  }

  return null;
}
