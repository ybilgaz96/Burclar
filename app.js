let selectedSign = null;
let currentPeriod = "daily";
let currentView = "horoscope";

function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random()
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.opacity += (Math.random() - 0.5) * 0.1;
      star.opacity = Math.max(0.1, Math.min(1, star.opacity));
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 240, 232, ${star.opacity})`;
      ctx.fill();
      
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = canvas.height;
        star.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  animate();
}

function updateMoonPhase() {
  const moon = getMoonPhase();
  const lang = getCurrentLanguage();
  const moonEl = document.getElementById("moon-phase");
  if (moonEl) {
    moonEl.innerHTML = `<span>${moon.emoji}</span> <span>${moon.lang[lang]}</span>`;
  }
}

function updateLanguageUI() {
  const lang = getCurrentLanguage();
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = lang === "tr" ? "EN" : "TR";
  
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });
}

function toggleLanguage() {
  const current = getCurrentLanguage();
  setLanguage(current === "tr" ? "en" : "tr");
  updateLanguageUI();
  if (selectedSign) renderReading();
}

function selectSign(signId) {
  selectedSign = signId;
  localStorage.setItem("userSign", signId);
  
  document.querySelectorAll(".zodiac-card").forEach(card => {
    card.classList.remove("selected");
  });
  
  const card = document.querySelector(`[data-sign="${signId}"]`);
  if (card) card.classList.add("selected");
}

function setPeriod(period) {
  currentPeriod = period;
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  const activeTab = document.querySelector(`[data-period="${period}"]`);
  if (activeTab) activeTab.classList.add("active");
  
  if (selectedSign) renderReading();
}

function showView(view) {
  currentView = view;
  
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  const viewMap = { horoscope: "daily", weekly: "weekly", monthly: "monthly" };
  const period = viewMap[view] || "daily";
  const activeTab = document.querySelector(`[data-period="${period}"]`);
  if (activeTab) activeTab.classList.add("active");
  
  const readingSection = document.getElementById("reading-section");
  const toolsSection = document.getElementById("tools-section");
  const premiumSection = document.getElementById("premium-section");
  
  if (readingSection) readingSection.classList.remove("hidden");
  if (toolsSection) toolsSection.classList.add("hidden");
  if (premiumSection) premiumSection.classList.add("hidden");
  
  if (selectedSign) renderReading();
}

function showTools() {
  currentView = "tools";
  
  const readingSection = document.getElementById("reading-section");
  const toolsSection = document.getElementById("tools-section");
  const premiumSection = document.getElementById("premium-section");
  
  if (readingSection) readingSection.classList.add("hidden");
  if (toolsSection) toolsSection.classList.remove("hidden");
  if (premiumSection) premiumSection.classList.add("hidden");
}

function showPremium() {
  currentView = "premium";
  
  const readingSection = document.getElementById("reading-section");
  const toolsSection = document.getElementById("tools-section");
  const premiumSection = document.getElementById("premium-section");
  
  if (readingSection) readingSection.classList.add("hidden");
  if (toolsSection) toolsSection.classList.add("hidden");
  if (premiumSection) premiumSection.classList.remove("hidden");
}

async function renderReading() {
  if (!selectedSign) return;
  
  const readingSection = document.getElementById("reading-section");
  const content = document.getElementById("reading-content");
  if (!readingSection || !content) return;
  
  readingSection.classList.remove("hidden");
  content.innerHTML = createLoadingHTML();
  readingSection.scrollIntoView({ behavior: "smooth" });
  
  try {
    const contentText = await getHoroscope(selectedSign, currentPeriod);
    const { energy, categories, luckyInfo, advice } = parseHoroscopeContent(contentText, getCurrentLanguage());
    const lucky = getLuckyInfo(luckyInfo);
    const signData = ZODIAC_SIGNS.find(s => s.id === selectedSign);
    const lang = getCurrentLanguage();
    
    const today = getTodayDate(lang);
    
    content.innerHTML = `
      <div class="reading-card">
        <div class="reading-header">
          <span class="reading-symbol">${signData?.symbol || "♈"}</span>
          <div class="reading-info">
            <h2>${getZodiacName(selectedSign)}</h2>
            <p class="date">${today}</p>
          </div>
        </div>
        
        ${energy ? `<div class="energy-summary">${energy}</div>` : ""}
        
        <div class="categories">
          ${categories.split("\n\n").map((cat, i) => {
            const icons = ["❤️", "💼", "🌿", "⭐"];
            const names = [t("categories.love"), t("categories.career"), t("categories.health"), t("categories.general")];
            return `
              <div class="category">
                <div class="category-icon">${icons[i] || "⭐"}</div>
                <div class="category-name">${names[i] || t("categories.general")}</div>
                <div class="category-content">${cat.trim()}</div>
              </div>
            `;
          }).join("")}
        </div>
        
        <div class="lucky-info">
          <div class="lucky-item">
            <div class="lucky-label">${t("lucky.number")}</div>
            <div class="lucky-value">${lucky.number}</div>
          </div>
          <div class="lucky-item">
            <div class="lucky-label">${t("lucky.color")}</div>
            <div class="lucky-value">${lucky.color}</div>
          </div>
          <div class="lucky-item">
            <div class="lucky-label">${t("lucky.day")}</div>
            <div class="lucky-value">${lucky.day}</div>
          </div>
        </div>
        
        ${advice ? `
          <div class="advice">
            <div class="advice-title">${lang === "tr" ? "Günün Tavsiyesi" : "Daily Advice"}</div>
            <div class="advice-content">${advice}</div>
          </div>
        ` : ""}
        
        <div class="share-buttons">
          <button class="share-btn" onclick="copyReading('${selectedSign}', \`${contentText.replace(/`/g, "\\`")}\`)">
            📋 ${t("share.copy")}
          </button>
          <button class="share-btn" onclick="shareToTwitter('${selectedSign}', \`${contentText.replace(/`/g, "\\`")}\`)">
            𝕏 ${lang === "tr" ? "X'te Paylaş" : "Share on X"}
          </button>
          <button class="share-btn" onclick="shareToWhatsApp('${selectedSign}', \`${contentText.replace(/`/g, "\\`")}\`)">
            💬 WhatsApp
          </button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Reading error:", error);
    content.innerHTML = createErrorHTML(t("error"), () => renderReading());
  }
}

function createLoadingHTML() {
  return `
    <div class="reading-card" style="text-align: center; padding: 60px;">
      <div class="loading-spinner">✨</div>
      <p class="loading-text">${t("loading")}</p>
    </div>
  `;
}

function createErrorHTML(message, retryFn) {
  return `
    <div class="error-message">
      <p>${message}</p>
      <button class="btn btn-secondary" onclick="(${retryFn.toString()})()">${t("retry")}</button>
    </div>
  `;
}

function copyReading(sign, content) {
  const text = `${getZodiacName(sign)} - ${getTodayDate()}\n\n${content}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast(t("share.copied"));
  });
}

function shareToTwitter(sign, content) {
  const text = encodeURIComponent(`${getZodiacName(sign)} burcu bugün: ${content.slice(0, 200)}...`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
}

function shareToWhatsApp(sign, content) {
  const text = encodeURIComponent(`${getZodiacName(sign)} - ${getTodayDate()}\n\n${content.slice(0, 500)}`);
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--glass-bg);
    border: 1px solid var(--accent-gold);
    color: var(--accent-gold);
    padding: 12px 24px;
    border-radius: 20px;
    z-index: 3000;
    animation: fadeIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

async function handleOracleSubmit() {
  if (!selectedSign) {
    alert(getCurrentLanguage() === "tr" ? "Lütfen önce burcunu seç!" : "Please select your sign first!");
    return;
  }
  
  if (!canAskOracle()) {
    const remainingEl = document.getElementById("oracles-remaining");
    if (remainingEl) remainingEl.textContent = t("oracle.limitReached");
    return;
  }
  
  const input = document.getElementById("oracle-input");
  const question = input?.value.trim();
  
  if (!question) return;
  
  const responseEl = document.getElementById("oracle-response");
  if (responseEl) responseEl.innerHTML = `<div class="loading-text" style="text-align:center;padding:20px;">${t("loading")}</div>`;
  
  incrementOracleCount();
  updateOracleCounter();
  
  try {
    const response = await askOracle(question, selectedSign);
    if (responseEl) {
      responseEl.innerHTML = `<div class="oracle-response">${response}</div>`;
    }
  } catch (error) {
    if (responseEl) responseEl.innerHTML = createErrorHTML(t("error"), () => handleOracleSubmit());
  }
}

function updateOracleCounter() {
  const { count } = getOraclesQuestionsToday();
  const remaining = 3 - count;
  const remainingEl = document.getElementById("oracles-remaining");
  if (remainingEl) {
    remainingEl.textContent = t("oracle.remaining").replace("{count}", remaining);
  }
}

async function handleCompatibility() {
  const sign1 = document.getElementById("compat-sign1")?.value;
  const sign2 = document.getElementById("compat-sign2")?.value;
  const resultEl = document.getElementById("compatibility-result");
  
  if (!sign1 || !sign2) return;
  
  if (resultEl) resultEl.innerHTML = `<div class="loading-text" style="text-align:center;padding:40px;">${t("loading")}</div>`;
  
  try {
    const content = await getCompatibility(sign1, sign2);
    const percentages = getCompatibilityPercentages(content);
    const lang = getCurrentLanguage();
    
    const chartUrl = createCompatibilityChart(percentages);
    
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="compatibility-result">
          <h3 style="font-family: 'Cinzel', serif; color: var(--accent-gold); margin-bottom: 20px;">
            ${getZodiacName(sign1)} + ${getZodiacName(sign2)}
          </h3>
          <img src="${chartUrl}" alt="Compatibility Chart" class="compatibility-chart" />
          <div class="compatibility-percentages">
            <div class="compatibility-percent">
              <div class="value">${percentages.love}%</div>
              <div class="label">${lang === "tr" ? "Aşk" : "Love"}</div>
            </div>
            <div class="compatibility-percent">
              <div class="value">${percentages.friendship}%</div>
              <div class="label">${lang === "tr" ? "Arkadaşlık" : "Friendship"}</div>
            </div>
            <div class="compatibility-percent">
              <div class="value">${percentages.work}%</div>
              <div class="label">${lang === "tr" ? "İş" : "Work"}</div>
            </div>
          </div>
          <p style="font-style: italic; color: var(--text-secondary);">${getCompatibilityMessage(percentages.love, lang)}</p>
          <div class="oracle-response" style="margin-top: 20px;">${content}</div>
        </div>
      `;
    }
  } catch (error) {
    if (resultEl) resultEl.innerHTML = createErrorHTML(t("error"), handleCompatibility);
  }
}

function handleBirthChart() {
  const name = document.getElementById("birth-name")?.value;
  const date = document.getElementById("birth-date")?.value;
  const resultEl = document.getElementById("birth-chart-result");
  
  if (!name || !date) {
    alert(getCurrentLanguage() === "tr" ? "Lütfen tüm alanları doldurun!" : "Please fill in all fields!");
    return;
  }
  
  const chart = calculateBirthChart(date);
  
  if (resultEl) {
    resultEl.innerHTML = `
      <div class="birth-chart-result">
        <div class="birth-chart-item">
          <div class="symbol">${ZODIAC_SIGNS.find(s => s.id === chart.sun)?.symbol || "☀️"}</div>
          <div class="label">${getCurrentLanguage() === "tr" ? "Güneş Burcu" : "Sun Sign"}</div>
          <div class="sign">${getZodiacName(chart.sun)}</div>
        </div>
        <div class="birth-chart-item">
          <div class="symbol">${ZODIAC_SIGNS.find(s => s.id === chart.moon)?.symbol || "☾"}</div>
          <div class="label">${getCurrentLanguage() === "tr" ? "Ay Burcu" : "Moon Sign"}</div>
          <div class="sign">${getZodiacName(chart.moon)}</div>
        </div>
        <div class="birth-chart-item">
          <div class="symbol">${ZODIAC_SIGNS.find(s => s.id === chart.rising)?.symbol || "⬆"}</div>
          <div class="label">${getCurrentLanguage() === "tr" ? "Yükselen" : "Rising"}</div>
          <div class="sign">${getZodiacName(chart.rising)}</div>
        </div>
      </div>
    `;
  }
}

function handleNumerology() {
  const name = document.getElementById("numerology-name")?.value;
  const date = document.getElementById("numerology-date")?.value;
  const resultEl = document.getElementById("numerology-result");
  
  if (!name || !date) {
    alert(getCurrentLanguage() === "tr" ? "Lütfen tüm alanları doldurun!" : "Please fill in all fields!");
    return;
  }
  
  const number = calculateNumerology(date, name);
  const lang = getCurrentLanguage();
  
  if (resultEl) {
    resultEl.innerHTML = `
      <div class="numerology-result">
        <div class="numerology-number">${number}</div>
        <p class="numerology-meaning">${getNumerologyMeaning(number, lang)}</p>
      </div>
    `;
  }
}

function initializeTarotAndMoon() {
  const lang = getCurrentLanguage();
  const card = getTodayTarot(lang);
  const tarotResultEl = document.getElementById("tarot-result");
  if (tarotResultEl) {
    tarotResultEl.innerHTML = `
      <div class="tarot-card-display">
        <div class="tarot-card">${card.id}</div>
        <div class="tarot-name">${card.name[lang]}</div>
        <div class="tarot-meaning">${card.meaning[lang]}</div>
      </div>
    `;
  }
  
  const moon = getMoonPhase();
  const advice = getMoonAdvice(moon.name, lang);
  const moonResultEl = document.getElementById("moon-result");
  if (moonResultEl) {
    moonResultEl.innerHTML = `
      <div class="moon-phase-display">
        <div class="moon-phase-emoji">${moon.emoji}</div>
        <div class="moon-phase-name">${moon.lang[lang]}</div>
        <p class="moon-phase-advice">${advice}</p>
      </div>
    `;
  }
}

function showTarot() {
  openModal("tarot-modal");
}

function showMoonCalendar() {
  openModal("moon-modal");
}

function createZodiacCards() {
  const container = document.getElementById("zodiac-grid");
  if (!container) return;
  
  const lang = getCurrentLanguage();
  container.innerHTML = ZODIAC_SIGNS.map(sign => `
    <div class="zodiac-card" data-sign="${sign.id}" onclick="selectSign('${sign.id}')">
      <span class="symbol">${sign.symbol}</span>
      <span class="name">${getZodiacName(sign.id).slice(0, 6)}</span>
    </div>
  `).join("");
  
  const savedSign = localStorage.getItem("userSign");
  if (savedSign) {
    selectSign(savedSign);
    selectedSign = savedSign;
  }
}

function populateCompatibilitySelects() {
  const select1 = document.getElementById("compat-sign1");
  const select2 = document.getElementById("compat-sign2");
  if (!select1 || !select2) return;
  
  const lang = getCurrentLanguage();
  const options = '<option value="">--</option>' + ZODIAC_SIGNS.map(sign => 
    `<option value="${sign.id}">${sign.symbol} ${getZodiacName(sign.id)}</option>`
  ).join("");
  
  select1.innerHTML = options;
  select2.innerHTML = options;
}

function initApp() {
  initStarfield();
  updateMoonPhase();
  updateLanguageUI();
  createZodiacCards();
  populateCompatibilitySelects();
  updateOracleCounter();
  initializeTarotAndMoon();
  
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) langToggle.addEventListener("click", toggleLanguage);
  
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const period = tab.getAttribute("data-period");
      setPeriod(period);
      if (period === "weekly" || period === "monthly") {
        currentView = period;
      } else {
        currentView = "horoscope";
      }
    });
  });
  
  document.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("click", () => {
      const tool = card.getAttribute("data-tool");
      switch (tool) {
        case "birth-chart": openModal("birth-chart-modal"); break;
        case "compatibility": openModal("compatibility-modal"); break;
        case "tarot": showTarot(); break;
        case "moon": showMoonCalendar(); break;
        case "oracle": openModal("oracle-modal"); break;
        case "numerology": openModal("numerology-modal"); break;
      }
    });
  });
  
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.classList.remove("active");
    });
  });
  
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  });
  
  const oracleInput = document.getElementById("oracle-input");
  if (oracleInput) {
    oracleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleOracleSubmit();
    });
  }
  
  const getReadingBtn = document.getElementById("get-reading-btn");
  if (getReadingBtn) {
    getReadingBtn.addEventListener("click", () => {
      if (selectedSign) {
        renderReading();
      } else {
        alert(getCurrentLanguage() === "tr" ? "Lütfen önce burcunu seç!" : "Please select your sign first!");
      }
    });
  }
  
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 100) {
        header.style.background = "rgba(10, 6, 18, 0.95)";
      } else {
        header.style.background = "linear-gradient(180deg, var(--bg-primary) 0%, transparent 100%)";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initApp);