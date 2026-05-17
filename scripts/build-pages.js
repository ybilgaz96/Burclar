const fs = require('fs');
const path = require('path');

const ZODIAC_SIGNS = [
  { id: 'aries', tr: 'Koç', en: 'Aries', symbol: '♈' },
  { id: 'taurus', tr: 'Boğa', en: 'Taurus', symbol: '♉' },
  { id: 'gemini', tr: 'İkizler', en: 'Gemini', symbol: '♊' },
  { id: 'cancer', tr: 'Yengeç', en: 'Cancer', symbol: '♋' },
  { id: 'leo', tr: 'Aslan', en: 'Leo', symbol: '♌' },
  { id: 'virgo', tr: 'Başak', en: 'Virgo', symbol: '♍' },
  { id: 'libra', tr: 'Terazi', en: 'Libra', symbol: '♎' },
  { id: 'scorpio', tr: 'Akrep', en: 'Scorpio', symbol: '♏' },
  { id: 'sagittarius', tr: 'Yay', en: 'Sagittarius', symbol: '♐' },
  { id: 'capricorn', tr: 'Oğlak', en: 'Capricorn', symbol: '♑' },
  { id: 'aquarius', tr: 'Kova', en: 'Aquarius', symbol: '♒' },
  { id: 'pisces', tr: 'Balık', en: 'Pisces', symbol: '♓' }
];

const SITE_URL = 'https://burclar-tau.vercel.app';

function slugify(text) {
  return text.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/\s+/g, '-');
}

function formatContent(text) {
  return text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
}

function getOtherSignsHtml(currentSignId, period) {
  return ZODIAC_SIGNS
    .filter(s => s.id !== currentSignId)
    .map(s => {
      const url = `/${slugify(s.tr)}-${period}.html`;
      return `<a href="${url}" class="sign-card"><span class="symbol">${s.symbol}</span><span class="name">${s.tr}</span></a>`;
    })
    .join('');
}

function getSignOptions(currentSignId) {
  return ZODIAC_SIGNS
    .map(s => `<option value="${s.id}" ${s.id === currentSignId ? 'selected' : ''}>${s.symbol} ${s.tr}</option>`)
    .join('');
}

function buildPages() {
  const dataDir = path.join(__dirname, '..', 'data');
  const templatesDir = path.join(__dirname, '..', 'templates');
  const pagesDir = path.join(__dirname, '..', 'pages');
  
  const templatePath = path.join(templatesDir, 'page.html');
  let template = fs.readFileSync(templatePath, 'utf8');

  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  if (dataFiles.length === 0) {
    console.log('No data files found in data/ directory');
    return;
  }

  const latestFile = dataFiles.sort().pop();
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, latestFile), 'utf8'));
  
  const dateDisplay = new Date(data.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  console.log(`Building pages from ${latestFile}...`);

  for (const sign of ZODIAC_SIGNS) {
    const signSlug = slugify(sign.tr);

    for (const period of ['daily', 'weekly', 'monthly']) {
      const periodData = data[period]?.[sign.id];
      if (!periodData) continue;

      const periodLabels = {
        daily: { label: 'Günlük', title: 'Günlük Yorumu', url: `/${signSlug}-gunluk.html` },
        weekly: { label: 'Haftalık', title: 'Haftalık Yorum', url: `/${signSlug}-haftalik.html` },
        monthly: { label: 'Aylık', title: 'Aylık Yorum', url: `/${signSlug}-aylik.html` }
      };

      const otherPeriods = Object.keys(periodLabels)
        .filter(p => p !== period)
        .map(p => ({
          ...periodLabels[p],
          active: ''
        }));

      const periodInfo = periodLabels[period];
      const canonicalUrl = `${SITE_URL}${periodInfo.url}`;
      const contentHtml = formatContent(periodData.content);

      let page = template
        .replace(/\{\{TITLE\}\}/g, `${sign.tr} Burcu ${periodInfo.title} - ${dateDisplay}`)
        .replace(/\{\{DESCRIPTION\}\}/g, `${sign.tr} burcu ${periodInfo.label.toLowerCase()} yorumu. ${periodData.content.slice(0, 150)}...`)
        .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl)
        .replace(/\{\{OG_TITLE\}\}/g, `${sign.tr} Burcu ${periodInfo.title}`)
        .replace(/\{\{OG_DESCRIPTION\}\}/g, periodData.content.slice(0, 200))
        .replace(/\{\{SCHEMA_HEADLINE\}\}/g, `${sign.tr} Burcu ${periodInfo.title}`)
        .replace(/\{\{SCHEMA_DESCRIPTION\}\}/g, periodData.content.slice(0, 500))
        .replace(/\{\{DATE_PUBLISHED\}\}/g, new Date().toISOString())
        .replace(/\{\{SIGN_SYMBOL\}\}/g, sign.symbol)
        .replace(/\{\{SIGN_NAME\}\}/g, sign.tr)
        .replace(/\{\{SIGN_PAGE_URL\}\}/g, `${signSlug}.html`)
        .replace(/\{\{PERIOD_LABEL\}\}/g, periodInfo.label)
        .replace(/\{\{PERIOD_TITLE\}\}/g, periodInfo.title)
        .replace(/\{\{DATE_DISPLAY\}\}/g, dateDisplay)
        .replace(/\{\{CONTENT\}\}/g, contentHtml)
        .replace(/\{\{LUCKY_NUMBER\}\}/g, periodData.lucky.number)
        .replace(/\{\{LUCKY_COLOR\}\}/g, periodData.lucky.color)
        .replace(/\{\{LUCKY_DAY\}\}/g, periodData.lucky.day)
        .replace(/\{\{OTHER_SIGNS\}\}/g, getOtherSignsHtml(sign.id, period === 'daily' ? 'gunluk' : period === 'weekly' ? 'haftalik' : 'aylik'))
        .replace(/\{\{SIGN_OPTIONS\}\}/g, getSignOptions(sign.id))
        .replace(/\{\{DAILY_URL\}\}/g, `/${signSlug}-gunluk.html`)
        .replace(/\{\{WEEKLY_URL\}\}/g, `/${signSlug}-haftalik.html`)
        .replace(/\{\{MONTHLY_URL\}\}/g, `/${signSlug}-aylik.html`)
        .replace(/\{\{DAILY_ACTIVE\}\}/g, period === 'daily' ? 'active' : '')
        .replace(/\{\{WEEKLY_ACTIVE\}\}/g, period === 'weekly' ? 'active' : '')
        .replace(/\{\{MONTHLY_ACTIVE\}\}/g, period === 'monthly' ? 'active' : '')
        .replace(/\{\{SITE_URL\}\}/g, SITE_URL);

      const outputPath = path.join(pagesDir, `${signSlug}-${period === 'daily' ? 'gunluk' : period === 'weekly' ? 'haftalik' : 'aylik'}.html`);
      fs.writeFileSync(outputPath, page);
      console.log(`  Created ${outputPath}`);
    }

    const signPageContent = buildSignIndexPage(sign, data);
    fs.writeFileSync(path.join(pagesDir, `${signSlug}.html`), signPageContent);
    console.log(`  Created ${signSlug}.html`);
  }

  buildSitemap();
  buildRobotsTxt();
  
  console.log('All pages built successfully!');
}

function buildSignIndexPage(sign, data) {
  const signSlug = slugify(sign.tr);
  const otherSigns = ZODIAC_SIGNS
    .filter(s => s.id !== sign.id)
    .map(s => `<a href="/${slugify(s.tr)}.html" class="sign-mini">${s.symbol} ${s.tr}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${sign.tr} Burcu - Günlük, Haftalık ve Aylık Yorumlar | KozmikRehber</title>
  <meta name="description" content="${sign.tr} burcu için astroloji yorumları. Günlük, haftalık ve aylık burç yorumlarını oku.">
  <link rel="canonical" href="${SITE_URL}/${signSlug}.html">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="main-content">
    <header>
      <div class="header-inner">
        <a href="/" class="logo">
          <span class="logo-symbol">🌙</span>
          <span class="logo-text">KozmikRehber</span>
        </a>
        <nav>
          <a href="/index.html" class="nav-link active">Ana Sayfa</a>
        </nav>
      </div>
    </header>
    <main class="sign-page">
      <div class="sign-hero">
        <span class="sign-symbol-large">${sign.symbol}</span>
        <h1>${sign.tr} Burcu</h1>
      </div>
      <div class="sign-links">
        <a href="/${signSlug}-gunluk.html" class="period-btn">📅 Günlük Yorum</a>
        <a href="/${signSlug}-haftalik.html" class="period-btn">📆 Haftalık Yorum</a>
        <a href="/${signSlug}-aylik.html" class="period-btn">📆 Aylık Yorum</a>
      </div>
      <section class="other-signs-mini">
        <h3>Diğer Burçlar</h3>
        <div class="signs-row">${otherSigns}</div>
      </section>
    </main>
    <footer>
      <div class="footer-content">
        <div class="footer-logo">🌙 KozmikRehber</div>
        <p>AI destekli burç yorumları platformu</p>
        <div class="footer-links">
          <a href="/index.html">Ana Sayfa</a>
        </div>
        <p class="copyright">© 2026 KozmikRehber. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  </div>
  <script src="/i18n.js"></script>
  <script src="/tools.js"></script>
  <script src="/app-init.js"></script>
</body>
</html>`;
}

function buildSitemap() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
  
  const urls = pages.map(page => {
    const url = page.replace('.html', '');
    return `  <url>
    <loc>${SITE_URL}/${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${page.includes('-gunluk') ? '0.9' : page.includes('-haftalik') ? '0.8' : '0.8'}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), sitemap);
  console.log('Created sitemap.xml');
}

function buildRobotsTxt() {
  const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;

  fs.writeFileSync(path.join(__dirname, '..', 'robots.txt'), robots);
  console.log('Created robots.txt');
}

buildPages();