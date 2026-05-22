const TRANSLATIONS = {
  tr: {
    siteName: "KozmikRehber",
    tagline: "Yıldızlar Sana Ne Söylüyor?",
    nav: {
      daily: "Günlük",
      weekly: "Haftalık",
      monthly: "Aylık",
      birthChart: "Doğum Haritası",
      compatibility: "Uyumluluk"
    },
    hero: {
      subtitle: "AI destekli burç yorumları",
      selectSign: "Burcunu Seç",
      getReading: "Yorumunu Al",
      today: "Bugün"
    },
    categories: {
      love: "Aşk",
      career: "Kariyer",
      health: "Sağlık",
      general: "Genel"
    },
    lucky: {
      number: "Şanslı Sayı",
      color: "Şanslı Renk",
      day: "Şanslı Gün"
    },
    share: {
      title: "Paylaş",
      copy: "Kopyala",
      copied: "Kopyalandı!",
      shareOnX: "X'te Paylaş"
    },
    tools: {
      birthChart: "Doğum Haritası",
      compatibility: "Burç Uyumluluğu",
      tarot: "Günlük Tarot",
      moonCalendar: "Ay Takvimi",
      oracle: "Soru Sor"
    },
    oracle: {
      placeholder: "Astrologa bir soru sor...",
      send: "Gönder",
      limitReached: "Günlük 3 sorun bitti. Yarın tekrar dene!",
      remaining: "Kalan soru: {count}"
    },
    footer: {
      tagline: "Bu site AI destekli burç yorumları sunar.",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Şartları"
    },
    loading: "Yıldızlar okunuyor...",
    error: "Evren şu an meşgul, tekrar dene",
    retry: "Tekrar Dene",
    alerts: {
      selectSign: "Lütfen önce burcunu seç!",
      fillAllFields: "Lütfen tüm alanları doldurun!",
      nameRequired: "Ad Soyad gerekli",
      emailRequired: "E-posta gerekli",
      messageRequired: "Mesaj gerekli"
    },
    contact: {
      title: "İletişim",
      name: "Ad Soyad",
      email: "E-posta",
      message: "Mesaj",
      submit: "Gönder",
      sent: "Mesajınız alındı! En kısa sürede dönüş yapacağız. 🌙"
    }
  },
  en: {
    siteName: "AstroOracle",
    tagline: "What Do The Stars Say To You?",
    nav: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      birthChart: "Birth Chart",
      compatibility: "Compatibility"
    },
    hero: {
      subtitle: "AI-powered horoscope readings",
      selectSign: "Select Your Sign",
      getReading: "Get Your Reading",
      today: "Today"
    },
    categories: {
      love: "Love",
      career: "Career",
      health: "Health",
      general: "General"
    },
    lucky: {
      number: "Lucky Number",
      color: "Lucky Color",
      day: "Lucky Day"
    },
    share: {
      title: "Share",
      copy: "Copy",
      copied: "Copied!",
      shareOnX: "Share on X"
    },
    tools: {
      birthChart: "Birth Chart",
      compatibility: "Zodiac Compatibility",
      tarot: "Daily Tarot",
      moonCalendar: "Moon Calendar",
      oracle: "Ask Oracle"
    },
    oracle: {
      placeholder: "Ask the astrologer a question...",
      send: "Send",
      limitReached: "Daily 3 questions reached. Try again tomorrow!",
      remaining: "Questions remaining: {count}"
    },
    footer: {
      tagline: "This site provides AI-powered horoscope readings.",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    },
    loading: "Reading the stars...",
    error: "The universe is busy, try again",
    retry: "Try Again",
    alerts: {
      selectSign: "Please select your sign first!",
      fillAllFields: "Please fill in all fields!",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      messageRequired: "Message is required"
    },
    contact: {
      title: "Contact",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send",
      sent: "Your message has been received! We'll get back to you soon. 🌙"
    }
  }
};

const ZODIAC_SIGNS = [
  { id: "aries", symbol: "♈", element: "fire", planet: "Mars" },
  { id: "taurus", symbol: "♉", element: "earth", planet: "Venus" },
  { id: "gemini", symbol: "♊", element: "air", planet: "Mercury" },
  { id: "cancer", symbol: "♋", element: "water", planet: "Moon" },
  { id: "leo", symbol: "♌", element: "fire", planet: "Sun" },
  { id: "virgo", symbol: "♍", element: "earth", planet: "Mercury" },
  { id: "libra", symbol: "♎", element: "air", planet: "Venus" },
  { id: "scorpio", symbol: "♏", element: "water", planet: "Pluto" },
  { id: "sagittarius", symbol: "♐", element: "fire", planet: "Jupiter" },
  { id: "capricorn", symbol: "♑", element: "earth", planet: "Saturn" },
  { id: "aquarius", symbol: "♒", element: "air", planet: "Uranus" },
  { id: "pisces", symbol: "♓", element: "water", planet: "Neptune" }
];

const ZODIAC_NAMES = {
  tr: {
    aries: "Koç",
    taurus: "Boğa",
    gemini: "İkizler",
    cancer: "Yengeç",
    leo: "Aslan",
    virgo: "Başak",
    libra: "Terazi",
    scorpio: "Akrep",
    sagittarius: "Yay",
    capricorn: "Oğlak",
    aquarius: "Kova",
    pisces: "Balık"
  },
  en: {
    aries: "Aries",
    taurus: "Taurus",
    gemini: "Gemini",
    cancer: "Cancer",
    leo: "Leo",
    virgo: "Virgo",
    libra: "Libra",
    scorpio: "Scorpio",
    sagittarius: "Sagittarius",
    capricorn: "Capricorn",
    aquarius: "Aquarius",
    pisces: "Pisces"
  }
};

const ELEMENTS = {
  tr: { fire: "Ateş", earth: "Toprak", air: "Hava", water: "Su" },
  en: { fire: "Fire", earth: "Earth", air: "Air", water: "Water" }
};

const LUCKY_COLORS = {
  tr: ["Kırmızı", "Mavi", "Yeşil", "Mor", "Altın", "Pembe", "Turuncu", "Lacivert"],
  en: ["Red", "Blue", "Green", "Purple", "Gold", "Pink", "Orange", "Navy"]
};

const LUCKY_DAYS = {
  tr: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
  en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
};

const MAJOR_ARCANA = [
  { id: 0, name: { tr: "Deli Boğa", en: "The Fool" }, meaning: { tr: "Yeni başlangıçlar, spontanlık, masumiyet", en: "New beginnings, spontaneity, innocence" } },
  { id: 1, name: { tr: "Büyücü", en: "The Magician" }, meaning: { tr: "İrade gücü, yaratıcılık, beceri", en: "Willpower, creativity, skill" } },
  { id: 2, name: { tr: "Yüce Rahibe", en: "The High Priestess" }, meaning: { tr: "Sezgi, gizem, içgörü", en: "Intuition, mystery, insight" } },
  { id: 3, name: { tr: "İmparatoriçe", en: "The Empress" }, meaning: { tr: "Anaçlık, bereket, yaratım", en: "Nurturing, abundance, creation" } },
  { id: 4, name: { tr: "İmparator", en: "The Emperor" }, meaning: { tr: "Otorite, yapı, baba figürü", en: "Authority, structure, father figure" } },
  { id: 5, name: { tr: "Hierophant", en: "The Hierophant" }, meaning: { tr: "Geleneksel değerler, eğitim, maneviyat", en: "Traditional values, education, spirituality" } },
  { id: 6, name: { tr: "Aşıklar", en: "The Lovers" }, meaning: { tr: "Aşk, tercihler, uyum", en: "Love, choices, harmony" } },
  { id: 7, name: { tr: "Savaş Arabası", en: "The Chariot" }, meaning: { tr: "Kontrol, kararlılık, zafer", en: "Control, determination, victory" } },
  { id: 8, name: { tr: "Güç", en: "Strength" }, meaning: { tr: "Güç, cesaret, tutku", en: "Strength, courage, passion" } },
  { id: 9, name: { tr: "Ermiş", en: "The Hermit" }, meaning: { tr: "İçe bakış, yalnızlık, rehberlik", en: "Introspection, solitude, guidance" } },
  { id: 10, name: { tr: "Gülümseyen Talih", en: "Wheel of Fortune" }, meaning: { tr: "Kader, dönüşüm, şans", en: "Fate, transformation, luck" } },
  { id: 11, name: { tr: "Adalet", en: "Justice" }, meaning: { tr: "Adalet, denge, gerçek", en: "Justice, balance, truth" } },
  { id: 12, name: { tr: "Asılmı Adam", en: "The Hanged Man" }, meaning: { tr: "Bekleme, fedakarlık, bakış açısı", en: "Waiting, sacrifice, perspective" } },
  { id: 13, name: { tr: "Ölüm", en: "Death" }, meaning: { tr: "Dönüşüm, sona erme, yeniden doğuş", en: "Transformation, ending, rebirth" } },
  { id: 14, name: { tr: "Denge", en: "Temperance" }, meaning: { tr: "Denge, uyum, sabır", en: "Balance, harmony, patience" } },
  { id: 15, name: { tr: "Şeytan", en: "The Devil" }, meaning: { tr: "Bağımlılık, karanlık, gölge", en: "Addiction, darkness, shadow" } },
  { id: 16, name: { tr: "Kule", en: "The Tower" }, meaning: { tr: "Ani değişim, yıkım, uyanış", en: "Sudden change, destruction, awakening" } },
  { id: 17, name: { tr: "Yıldız", en: "The Star" }, meaning: { tr: "Umut, ilham, yenilenme", en: "Hope, inspiration, renewal" } },
  { id: 18, name: { tr: "Ay", en: "The Moon" }, meaning: { tr: "Yanılsama, korku, bilinçaltı", en: "Illusion, fear, subconscious" } },
  { id: 19, name: { tr: "Güneş", en: "The Sun" }, meaning: { tr: "Mutluluk, başarı, canlılık", en: "Happiness, success, vitality" } },
  { id: 20, name: { tr: "Yargılama", en: "Judgement" }, meaning: { tr: "Yeniden değerlendirme, uyanış, yargı", en: "Reevaluation, awakening, judgement" } },
  { id: 21, name: { tr: "Dünya", en: "The World" }, meaning: { tr: "Tamamlanma, başarı, bütünleşme", en: "Completion, achievement, integration" } }
];

function t(key, lang = null) {
  const l = lang || getCurrentLanguage();
  const keys = key.split(".");
  let value = TRANSLATIONS[l];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

function getCurrentLanguage() {
  return localStorage.getItem("language") || "tr";
}

function setLanguage(lang) {
  localStorage.setItem("language", lang);
  document.documentElement.lang = lang;
  clearHoroscopeCache();
}

function clearHoroscopeCache() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('horoscope_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

function getZodiacName(id, lang = null) {
  const l = lang || getCurrentLanguage();
  return ZODIAC_NAMES[l]?.[id] || id;
}

function getElement(id, lang = null) {
  const l = lang || getCurrentLanguage();
  return ELEMENTS[l]?.[id] || id;
}

function getTodayDate(lang = null) {
  const l = lang || getCurrentLanguage();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString(l === "tr" ? "tr-TR" : "en-US", options);
}