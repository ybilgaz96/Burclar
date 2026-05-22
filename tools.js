function calculateBirthChart(birthDate) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const sunSign = getSunSign(month, day);
  const moonSign = getMoonSign(month, day);
  const risingSign = getRisingSign(month, day);

  return {
    sun: sunSign,
    moon: moonSign,
    rising: risingSign
  };
}

const ZODIAC_WITH_DATES = [
  { id: "aries", start: [3, 21], end: [4, 19] },
  { id: "taurus", start: [4, 20], end: [5, 20] },
  { id: "gemini", start: [5, 21], end: [6, 20] },
  { id: "cancer", start: [6, 21], end: [7, 22] },
  { id: "leo", start: [7, 23], end: [8, 22] },
  { id: "virgo", start: [8, 23], end: [9, 22] },
  { id: "libra", start: [9, 23], end: [10, 22] },
  { id: "scorpio", start: [10, 23], end: [11, 21] },
  { id: "sagittarius", start: [11, 22], end: [12, 21] },
  { id: "capricorn", start: [12, 22], end: [1, 19] },
  { id: "aquarius", start: [1, 20], end: [2, 18] },
  { id: "pisces", start: [2, 19], end: [3, 20] }
];

function getSunSign(month, day) {
  for (const sign of ZODIAC_WITH_DATES) {
    if (month === sign.start[0] && day >= sign.start[1]) return sign.id;
    if (month === sign.end[0] && day <= sign.end[1]) return sign.id;
    if (month > sign.start[0] && month < sign.end[0]) return sign.id;
  }
  return "capricorn";
}

function getMoonSign(month, day) {
  const seed = (month * 31 + day) % 12;
  return ZODIAC_SIGNS[seed].id;
}

function getRisingSign(month, day) {
  const seed = (month * 17 + day * 3) % 12;
  return ZODIAC_SIGNS[seed].id;
}

function getCompatibilityScore(sign1, sign2) {
  const scores = {
    aries: { aries: 70, taurus: 60, gemini: 75, cancer: 65, leo: 85, virgo: 55, libra: 70, scorpio: 80, sagittarius: 90, capricorn: 50, aquarius: 75, pisces: 65 },
    taurus: { aries: 60, taurus: 80, gemini: 55, cancer: 85, leo: 70, virgo: 75, libra: 90, scorpio: 65, sagittarius: 55, capricorn: 85, aquarius: 60, pisces: 75 },
    gemini: { aries: 75, taurus: 55, gemini: 80, cancer: 60, leo: 75, virgo: 70, libra: 85, scorpio: 65, sagittarius: 80, capricorn: 55, aquarius: 90, pisces: 65 },
    cancer: { aries: 65, taurus: 85, gemini: 60, cancer: 80, leo: 70, virgo: 75, libra: 65, scorpio: 85, sagittarius: 55, capricorn: 75, aquarius: 60, pisces: 90 },
    leo: { aries: 85, taurus: 70, gemini: 75, cancer: 70, leo: 80, virgo: 60, libra: 85, scorpio: 75, sagittarius: 90, capricorn: 55, aquarius: 70, pisces: 65 },
    virgo: { aries: 55, taurus: 75, gemini: 70, cancer: 75, leo: 60, virgo: 80, libra: 75, scorpio: 70, sagittarius: 65, capricorn: 90, aquarius: 65, pisces: 80 },
    libra: { aries: 70, taurus: 90, gemini: 85, cancer: 65, leo: 85, virgo: 75, libra: 80, scorpio: 70, sagittarius: 75, capricorn: 65, aquarius: 85, pisces: 70 },
    scorpio: { aries: 80, taurus: 65, gemini: 65, cancer: 85, leo: 75, virgo: 70, libra: 70, scorpio: 80, sagittarius: 65, capricorn: 85, aquarius: 75, pisces: 90 },
    sagittarius: { aries: 90, taurus: 55, gemini: 80, cancer: 55, leo: 90, virgo: 65, libra: 75, scorpio: 65, sagittarius: 80, capricorn: 60, aquarius: 80, pisces: 60 },
    capricorn: { aries: 50, taurus: 85, gemini: 55, cancer: 75, leo: 55, virgo: 90, libra: 65, scorpio: 85, sagittarius: 60, capricorn: 80, aquarius: 70, pisces: 80 },
    aquarius: { aries: 75, taurus: 60, gemini: 90, cancer: 60, leo: 70, virgo: 65, libra: 85, scorpio: 75, sagittarius: 80, capricorn: 70, aquarius: 80, pisces: 65 },
    pisces: { aries: 65, taurus: 75, gemini: 65, cancer: 90, leo: 65, virgo: 80, libra: 70, scorpio: 90, sagittarius: 60, capricorn: 80, aquarius: 65, pisces: 80 }
  };
  
  return scores[sign1]?.[sign2] || 70;
}

function getCompatibilityMessage(score, lang) {
  if (score >= 85) {
    return lang === "tr" ? "Mükemmel uyum! Yıldızlar sizinles." : "Perfect match! The stars are aligned for you.";
  } else if (score >= 70) {
    return lang === "tr" ? "İyi bir uyum. Pozitif enerji mevcut." : "Good compatibility. Positive energy exists.";
  } else if (score >= 55) {
    return lang === "tr" ? "Ortalama uyum. Çaba gerektirebilir." : "Average compatibility. May require effort.";
  } else {
    return lang === "tr" ? "Zorlu bir uyum. Ama aşk her şeyi aşar!" : "Challenging compatibility. But love conquers all!";
  }
}

function getTodayTarot(lang) {
  const today = new Date().toDateString();
  const seed = new Date(today).getTime();
  const index = seed % MAJOR_ARCANA.length;
  const card = MAJOR_ARCANA[Math.abs(index)];
  
  const stored = localStorage.getItem("tarot_date");
  const storedCard = localStorage.getItem("tarot_card");
  
  if (stored === today && storedCard) {
    return JSON.parse(storedCard);
  }
  
  localStorage.setItem("tarot_date", today);
  localStorage.setItem("tarot_card", JSON.stringify(card));
  
  return card;
}

function calculateNumerology(birthDate, name) {
  const digits = birthDate.replace(/\D/g, "").split("").map(Number);
  const nameDigits = name.split("").map(c => c.charCodeAt(0) - 64).filter(n => n > 0 && n <= 26);
  
  let sum = digits.reduce((a, b) => a + b, 0) + nameDigits.reduce((a, b) => a + b, 0);
  
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split("").reduce((a, b) => a + parseInt(b), 0);
  }
  
  return sum;
}

function getNumerologyMeaning(number, lang) {
  const meanings = {
    1: { tr: "Liderlik, bağımsızlık, yenilik", en: "Leadership, independence, innovation" },
    2: { tr: "İşbirliği, denge, uyum", en: "Cooperation, balance, harmony" },
    3: { tr: "Yaratıcılık, iletişim, ifade", en: "Creativity, communication, expression" },
    4: { tr: "Çalışma, istikrar, pratiklik", en: "Work, stability, practicality" },
    5: { tr: "Özgürlük, macera, değişim", en: "Freedom, adventure, change" },
    6: { tr: "Sorumluluk, aile, bakım", en: "Responsibility, family, nurturing" },
    7: { tr: "Ruhaniyet, içgörü, analiz", en: "Spirituality, insight, analysis" },
    8: { tr: "Güç, bolluk, otorite", en: "Power, abundance, authority" },
    9: { tr: "Humanizm, fedakarlık, tamamlama", en: "Humanitarianism, sacrifice, completion" },
    11: { tr: "Sezgisel usta, vizyon", en: "Intuitive master, vision" },
    22: { tr: "Usta inşaatçı, master sayı", en: "Master builder, master number" },
    33: { tr: "Evrensel hizmet, master öğretmen", en: "Universal service, master teacher" }
  };
  
  return meanings[number]?.[lang] || meanings[number]?.en || "";
}

function getMoonPhase() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  let c, e, jd, b;
  
  if (month < 3) {
    year--;
    month += 12;
  }
  
  c = Math.floor(year / 100);
  e = Math.floor(0.25 * c);
  jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524.5;
  b = Math.floor(jd / 7) * 7;
  
  const phase = ((jd - b - 2.5) / 7) % 1;
  const normalizedPhase = phase < 0 ? phase + 1 : phase;
  
  if (normalizedPhase < 0.0625) return { name: "new", emoji: "🌑", lang: { tr: "Yeni Ay", en: "New Moon" } };
  if (normalizedPhase < 0.1875) return { name: "waxing_crescent", emoji: "🌒", lang: { tr: "Hilal", en: "Waxing Crescent" } };
  if (normalizedPhase < 0.3125) return { name: "first_quarter", emoji: "🌓", lang: { tr: "İlk Dördün", en: "First Quarter" } };
  if (normalizedPhase < 0.4375) return { name: "waxing_gibbous", emoji: "🌔", lang: { tr: "Şişkin Ay", en: "Waxing Gibbous" } };
  if (normalizedPhase < 0.5625) return { name: "full", emoji: "🌕", lang: { tr: "Dolunay", en: "Full Moon" } };
  if (normalizedPhase < 0.6875) return { name: "waning_gibbous", emoji: "🌖", lang: { tr: "Şişkin Ay (Azalan)", en: "Waning Gibbous" } };
  if (normalizedPhase < 0.8125) return { name: "last_quarter", emoji: "🌗", lang: { tr: "Son Dördün", en: "Last Quarter" } };
  if (normalizedPhase < 0.9375) return { name: "waning_crescent", emoji: "🌘", lang: { tr: "Hilal (Azalan)", en: "Waning Crescent" } };
  return { name: "new", emoji: "🌑", lang: { tr: "Yeni Ay", en: "New Moon" } };
}

function getMoonAdvice(phase, lang) {
  const advice = {
    new: { tr: "Yeni başlangıçlar için ideal zaman. Yeni niyetler belirle ve yeni projelere başla.", en: "Ideal time for new beginnings. Set new intentions and start new projects." },
    waxing_crescent: { tr: "Hilal büyüyor. Hedeflerini netleştir ve adımlarını atmaya başla.", en: "The crescent is growing. Clarify your goals and start taking steps." },
    first_quarter: { tr: "Kararların ve aksiyonun zamanı. Engelleri aşmak için çalış.", en: "Time for decisions and action. Work on overcoming obstacles." },
    waxing_gibbous: { tr: "Olgunlaşma dönemi. Detayları düzelt ve ilerlemeyi değerlendir.", en: "Time of maturation. Refine details and evaluate progress." },
    full: { tr: "Dolunay enerjisi dorukta. Hisset ve bırak. Vedalaşmak için ideal zaman.", en: "Full moon energy is at peak. Feel and let go. Ideal time for saying goodbye." },
    waning_gibbous: { tr: "Şükran ve paylaşım zamanı. Sevdiklerinle bağlarını güçlendir.", en: "Time for gratitude and sharing. Strengthen bonds with loved ones." },
    last_quarter: { tr: "Temizlik ve release zamanı. Gereksiz şeylerden arın.", en: "Time for cleanup and release. Clear away what no longer serves you." },
    waning_crescent: { tr: "Dinlenme ve hazırlık zamanı. İçe bakış için ideal.", en: "Time for rest and preparation. Ideal for introspection." }
  };
  
  return advice[phase]?.[lang] || advice[phase]?.en || "";
}

function createCompatibilityChart(percentages) {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  
  ctx.clearRect(0, 0, 300, 300);
  
  const labels = ["Aşk\nLove", "Arkadaşlık\nFriendship", "İş\nWork"];
  const values = [percentages.love, percentages.friendship, percentages.work];
  const colors = ["#d4af37", "#7b2d8b", "#f5f0e8"];
  
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
    const value = values[i] / 100;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * value, angle, angle + 2 * Math.PI / 3);
    ctx.closePath();
    ctx.fillStyle = colors[i] + "40";
    ctx.fill();
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const labelX = centerX + (radius + 30) * Math.cos(angle + Math.PI / 3);
    const labelY = centerY + (radius + 30) * Math.sin(angle + Math.PI / 3);
    
    ctx.fillStyle = "#f5f0e8";
    ctx.font = "12px EB Garamond";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], labelX, labelY);
    
    ctx.fillStyle = "#d4af37";
    ctx.font = "bold 16px EB Garamond";
    ctx.fillText(values[i] + "%", labelX, labelY + 18);
  }
  
  return canvas.toDataURL();
}

function shareReading(sign, content) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 500;
  const ctx = canvas.getContext("2d");
  
  const gradient = ctx.createLinearGradient(0, 0, 400, 500);
  gradient.addColorStop(0, "#0a0612");
  gradient.addColorStop(1, "#0d0a1e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 500);
  
  const signData = ZODIAC_SIGNS.find(s => s.id === sign);
  
  ctx.fillStyle = "#d4af37";
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.fillText(signData?.symbol || "♈", 200, 100);
  
  ctx.fillStyle = "#f5f0e8";
  ctx.font = "24px Cinzel";
  ctx.fillText(getZodiacName(sign), 200, 150);
  
  ctx.fillStyle = "#f5f0e8";
  ctx.font = "16px EB Garamond";
  ctx.textAlign = "center";
  
  const lines = content.slice(0, 200).split("\n");
  lines.forEach((line, i) => {
    ctx.fillText(line.slice(0, 40), 200, 200 + i * 24);
  });
  
  ctx.fillStyle = "#d4af37";
  ctx.font = "12px EB Garamond";
  ctx.fillText("KozmikRehber", 200, 460);
  
  return canvas.toDataURL("image/png");
}