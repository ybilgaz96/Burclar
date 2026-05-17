const CACHE_DURATION = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
  oracle: 60 * 60 * 1000,
  compatibility: 24 * 60 * 60 * 1000
};

const SYSTEM_PROMPT = `Sen AstroOracle platformunun mistik astroloji asistanısın. Türkçe veya İngilizce yaz (kullanıcının diline göre). Mistik, sıcak, umut verici ama gerçekçi bir dil kullan. Asla kesin tahminler yapma, rehberlik sun. Her yorumda pratik bir tavsiye ekle. Yanıtları format: önce enerji özeti, sonra kategoriler, son tavsiye. Emojileri ölçülü kullan (paragraf başına 1).`;

async function callAI(prompt, type = "horoscope") {
  const model = "deepseek-v4-flash";
  
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model, type })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.content) {
    throw new Error("No content in API response");
  }
  
  return data.content;
}

function getCacheKey(sign, period, lang) {
  return `horoscope_${sign}_${period}_${lang}`;
}

function getFromCache(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  const cacheDuration = key.includes("oracle") ? CACHE_DURATION.oracle : 
                        key.includes("weekly") ? CACHE_DURATION.weekly :
                        key.includes("monthly") ? CACHE_DURATION.monthly :
                        key.includes("compatibility") ? CACHE_DURATION.compatibility :
                        CACHE_DURATION.daily;
  
  if (Date.now() - timestamp > cacheDuration) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data;
}

function saveToCache(key, data) {
  localStorage.setItem(key, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}

function getDailyPrompt(sign, date, lang) {
  const signName = getZodiacName(sign, lang);
  const dateStr = new Date(date).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US");
  
  if (lang === "tr") {
    return `Sen uzman bir astrolog olarak ${signName} burcu için ${dateStr} tarihine ait günlük yorum yaz. Aşk, kariyer, sağlık ve genel enerji konularında ayrı paragraflar halinde, mistik ama pratik bir dil kullan. Şanslı sayı, renk ve günü de belirt. 150-200 kelime. Format: [ENERJİ ÖZETİ]\n[ kategoriler]\n[ŞANSLI SAYI: X] [ŞANSLI RENK: X] [ŞANSLI GÜN: X]\n[TAVSİYE]`;
  } else {
    return `You are an expert astrologer writing a daily horoscope for ${signName} on ${dateStr}. Write in separate paragraphs about love, career, health and general energy, using mystical but practical language. Include lucky number, color and day. 150-200 words. Format: [ENERGY SUMMARY]\n[CATEGORIES]\n[LUCKY NUMBER: X] [LUCKY COLOR: X] [LUCKY DAY: X]\n[ADVICE]`;
  }
}

function getWeeklyPrompt(sign, weekStart, weekEnd, lang) {
  const signName = getZodiacName(sign, lang);
  
  if (lang === "tr") {
    return `${signName} burcu için ${weekStart} - ${weekEnd} haftasına ait haftalık astroloji yorumu yaz. Her gün için kısa bir enerji notu, haftanın genel teması, önemli gezegen geçişleri ve 5 pratik tavsiye içersin. 300-400 kelime.`;
  } else {
    return `Write a weekly astrology reading for ${signName} for the week of ${weekStart} to ${weekEnd}. Include a short energy note for each day, the week's general theme, important planetary transits and 5 practical tips. 300-400 words.`;
  }
}

function getMonthlyPrompt(sign, month, year, lang) {
  const signName = getZodiacName(sign, lang);
  const monthName = new Date(year, month).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { month: "long" });
  
  if (lang === "tr") {
    return `${signName} burcu için ${monthName} ${year} ayına ait aylık astroloji yorumu yaz. Ay boyunca önemli astrolojik olayları, bu ay öne çıkan temaları (kariyer, aşk, finans, kişisel gelişim), ve ay sonu özeti ile tavsiyeleri içersin. 400-500 kelime.`;
  } else {
    return `Write a monthly astrology reading for ${signName} for ${monthName} ${year}. Include important astrological events during the month, highlighted themes (career, love, finance, personal growth), and end of month summary with advice. 400-500 words.`;
  }
}

function getCompatibilityPrompt(sign1, sign2, lang) {
  const sign1Name = getZodiacName(sign1, lang);
  const sign2Name = getZodiacName(sign2, lang);
  
  if (lang === "tr") {
    return `${sign1Name} ve ${sign2Name} burçları arasındaki aşk uyumluluğunu analiz et. Aşk, arkadaşlık ve iş uyumluluğu için ayrı yüzdeler ver. Radar grafik için verilerle birlikte detaylı bir yorum yaz. 200-250 kelime.`;
  } else {
    return `Analyze the love compatibility between ${sign1Name} and ${sign2Name} signs. Give separate percentages for love, friendship and work compatibility. Write a detailed reading with data for radar chart. 200-250 words.`;
  }
}

function getOraclePrompt(question, sign, lang) {
  const signName = getZodiacName(sign, lang);
  
  if (lang === "tr") {
    return `${signName} burcu perspektifinden, mistik ve astrolojik dil kullanarak şu soruya yanıt ver: "${question}". Kısa ve öz (100-150 kelime) yanıt ver.`;
  } else {
    return `From the perspective of ${signName} sign, answer this question using mystical and astrological language: "${question}". Give a short and concise answer (100-150 words).`;
  }
}

async function getHoroscope(sign, period = "daily", forceRefresh = false) {
  const lang = getCurrentLanguage();
  const cacheKey = getCacheKey(sign, period, lang);
  
  if (!forceRefresh) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }
  
  const today = new Date();
  let prompt;
  
  switch (period) {
    case "weekly":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      prompt = getWeeklyPrompt(
        sign,
        weekStart.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US"),
        weekEnd.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US"),
        lang
      );
      break;
    case "monthly":
      prompt = getMonthlyPrompt(sign, today.getMonth(), today.getFullYear(), lang);
      break;
    default:
      prompt = getDailyPrompt(sign, today, lang);
  }
  
  const content = await callAI(prompt, "horoscope");
  saveToCache(cacheKey, content);
  
  return content;
}

async function getCompatibility(sign1, sign2, forceRefresh = false) {
  const lang = getCurrentLanguage();
  const cacheKey = `compatibility_${sign1}_${sign2}_${lang}`;
  
  if (!forceRefresh) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }
  
  const prompt = getCompatibilityPrompt(sign1, sign2, lang);
  const content = await callAI(prompt, "horoscope");
  saveToCache(cacheKey, content);
  
  return content;
}

async function askOracle(question, sign) {
  const lang = getCurrentLanguage();
  const cacheKey = `oracle_${sign}_${question.slice(0, 50)}_${lang}`;
  
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  
  const prompt = getOraclePrompt(question, sign, lang);
  const content = await callAI(prompt, "oracle");
  saveToCache(cacheKey, content);
  
  return content;
}

function parseHoroscopeContent(content, lang) {
  console.log("AI Response content length:", content?.length);
  console.log("AI Response preview:", content?.slice(0, 200));
  
  if (!content || content.trim().length === 0) {
    console.error("Empty content received from API");
    return {
      fullContent: "İçerik yüklenemedi. Lütfen tekrar deneyin.",
      lucky: getLuckyInfo("")
    };
  }
  
  const lucky = getLuckyInfo(content);
  console.log("Extracted lucky info:", lucky);
  
  return {
    fullContent: content,
    lucky: lucky
  };
}

function getLuckyInfo(luckyInfo) {
  const numberMatch = luckyInfo.match(/\d+/);
  const colorKeywords = ["kırmızı", "mavi", "yeşil", "mor", "altın", "pembe", "turuncu", "lacivert", "red", "blue", "green", "purple", "gold", "pink", "orange", "navy"];
  const colorMatch = colorKeywords.find(c => luckyInfo.toLowerCase().includes(c));
  const dayKeywords = [...LUCKY_DAYS.tr.map(d => d.toLowerCase()), ...LUCKY_DAYS.en.map(d => d.toLowerCase())];
  const dayMatch = dayKeywords.find(d => luckyInfo.toLowerCase().includes(d));
  
  return {
    number: numberMatch ? parseInt(numberMatch[0]) : Math.floor(Math.random() * 99) + 1,
    color: colorMatch || LUCKY_COLORS.en[Math.floor(Math.random() * LUCKY_COLORS.en.length)],
    day: dayMatch || LUCKY_DAYS.en[Math.floor(Math.random() * LUCKY_DAYS.en.length)]
  };
}

function getOraclesQuestionsToday() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem("oracle_tracking");
  
  if (!stored) return { date: today, count: 0 };
  
  const { date, count } = JSON.parse(stored);
  if (date !== today) {
    return { date: today, count: 0 };
  }
  
  return { date, count };
}

function incrementOracleCount() {
  const current = getOraclesQuestionsToday();
  current.count++;
  localStorage.setItem("oracle_tracking", JSON.stringify(current));
}

function canAskOracle() {
  const { count } = getOraclesQuestionsToday();
  return count < 3;
}

function getCompatibilityPercentages(content) {
  const loveMatch = content.match(/a[şs]k.*?(\d+)%/i) || content.match(/love.*?(\d+)%/i);
  const friendMatch = content.match(/arkada[şs]l.*?(\d+)%/i) || content.match(/friend.*?(\d+)%/i);
  const workMatch = content.match(/i[şs].*?(\d+)%/i) || content.match(/work.*?(\d+)%/i);
  
  return {
    love: loveMatch ? parseInt(loveMatch[1]) : Math.floor(Math.random() * 30) + 70,
    friendship: friendMatch ? parseInt(friendMatch[1]) : Math.floor(Math.random() * 30) + 60,
    work: workMatch ? parseInt(workMatch[1]) : Math.floor(Math.random() * 30) + 55
  };
}