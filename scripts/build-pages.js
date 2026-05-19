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
const ARCHIVE_DAILY_COUNT = 7;
const ARCHIVE_WEEKLY_COUNT = 4;
const ARCHIVE_MONTHLY_COUNT = 12;

function slugify(text) {
  return text.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/\s+/g, '-');
}

function formatContent(text) {
  return text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
}

function parseDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getWeekDisplay(weekIso) {
  const [year, week] = weekIso.split('-W');
  const jan1 = new Date(parseInt(year), 0, 1);
  const daysToMonday = (jan1.getDay() || 7) - 1;
  const firstMonday = new Date(jan1);
  firstMonday.setDate(jan1.getDate() - daysToMonday);
  const targetDate = new Date(firstMonday);
  targetDate.setDate(firstMonday.getDate() + (parseInt(week) - 1) * 7);
  const endDate = new Date(targetDate);
  endDate.setDate(targetDate.getDate() + 6);
  return `${targetDate.toLocaleDateString('tr-TR')} - ${endDate.toLocaleDateString('tr-TR')}`;
}

function getMonthDisplay(monthStr) {
  const [year, month] = monthStr.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
}

function getOtherSignsHtml(currentSignId, period, dateLabel) {
  return ZODIAC_SIGNS
    .filter(s => s.id !== currentSignId)
    .map(s => {
      const url = `/${slugify(s.tr)}-${period}${dateLabel ? '-' + dateLabel : ''}.html`;
      return `<a href="${url}" class="sign-card"><span class="symbol">${s.symbol}</span><span class="name">${s.tr}</span></a>`;
    })
    .join('');
}

function getSignOptions(currentSignId) {
  return ZODIAC_SIGNS
    .map(s => `<option value="${s.id}" ${s.id === currentSignId ? 'selected' : ''}>${s.symbol} ${s.tr}</option>`)
    .join('');
}

function getDateNavigationHtml(signSlug, period, dateKey, allDateKeys, periodLabel) {
  const currentIndex = allDateKeys.indexOf(dateKey);
  const prevKey = currentIndex > 0 ? allDateKeys[currentIndex - 1] : null;
  const nextKey = currentIndex < allDateKeys.length - 1 ? allDateKeys[currentIndex + 1] : null;

  let prevHtml = '';
  let nextHtml = '';

  if (prevKey) {
    const prevUrl = `/${signSlug}-${period}-${prevKey}.html`;
    const prevLabel = period === 'gunluk' ? parseDateDisplay(prevKey) : period === 'haftalik' ? getWeekDisplay(prevKey) : getMonthDisplay(prevKey);
    prevHtml = `<a href="${prevUrl}" class="nav-btn nav-btn-prev">← ${prevLabel}</a>`;
  }

  if (nextKey) {
    const nextUrl = `/${signSlug}-${period}-${nextKey}.html`;
    const nextLabel = period === 'gunluk' ? parseDateDisplay(nextKey) : period === 'haftalik' ? getWeekDisplay(nextKey) : getMonthDisplay(nextKey);
    nextHtml = `<a href="${nextUrl}" class="nav-btn nav-btn-next">${nextLabel} →</a>`;
  }

  if (!prevHtml && !nextHtml) return '';

  return `<div class="date-navigation">${prevHtml}${nextHtml}</div>`;
}

function loadDataFiles() {
  const dataDir = path.join(__dirname, '..', 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

  const dailyFiles = files.filter(f => f.startsWith('daily-')).sort().reverse();
  const weeklyFiles = files.filter(f => f.startsWith('weekly-')).sort().reverse();
  const monthlyFiles = files.filter(f => f.startsWith('monthly-')).sort().reverse();

  const latestDaily = dailyFiles[0] ? JSON.parse(fs.readFileSync(path.join(dataDir, dailyFiles[0]), 'utf8')) : null;
  const latestWeekly = weeklyFiles[0] ? JSON.parse(fs.readFileSync(path.join(dataDir, weeklyFiles[0]), 'utf8')) : null;
  const latestMonthly = monthlyFiles[0] ? JSON.parse(fs.readFileSync(path.join(dataDir, monthlyFiles[0]), 'utf8')) : null;

  const archives = {
    daily: dailyFiles.slice(0, ARCHIVE_DAILY_COUNT).map(f => ({
      key: f.replace('daily-', '').replace('.json', ''),
      data: JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'))
    })),
    weekly: weeklyFiles.slice(0, ARCHIVE_WEEKLY_COUNT).map(f => ({
      key: f.replace('weekly-', '').replace('.json', ''),
      data: JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'))
    })),
    monthly: monthlyFiles.slice(0, ARCHIVE_MONTHLY_COUNT).map(f => ({
      key: f.replace('monthly-', '').replace('.json', ''),
      data: JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'))
    }))
  };

  return { latestDaily, latestWeekly, latestMonthly, archives, dailyFiles, weeklyFiles, monthlyFiles };
}

function buildPages() {
  const dataDir = path.join(__dirname, '..', 'data');
  const templatesDir = path.join(__dirname, '..', 'templates');
  const rootDir = path.join(__dirname, '..');

  const templatePath = path.join(templatesDir, 'page.html');
  let template = fs.readFileSync(templatePath, 'utf8');

  console.log('Cleaning up old generated HTML files...');
  const oldSlugs = ['koch', 'yengech', 'bashak', 'ikizler'];
  oldSlugs.forEach(slug => {
    ['', '-gunluk', '-haftalik', '-aylik'].forEach(suffix => {
      const file = path.join(rootDir, `${slug}${suffix}.html`);
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`  Deleted ${slug}${suffix}.html`);
      }
    });
  });

  const existingHtml = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'index.html');
  existingHtml.forEach(f => {
    fs.unlinkSync(path.join(rootDir, f));
    console.log(`  Deleted ${f}`);
  });

  if (!fs.existsSync(dataDir) || fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).length === 0) {
    console.log('No data files found in data/ directory');
    return;
  }

  const { latestDaily, latestWeekly, latestMonthly, archives, dailyFiles, weeklyFiles, monthlyFiles } = loadDataFiles();

  console.log(`Data loaded:`);
  console.log(`  Daily files: ${dailyFiles.length}`);
  console.log(`  Weekly files: ${weeklyFiles.length}`);
  console.log(`  Monthly files: ${monthlyFiles.length}`);

  for (const sign of ZODIAC_SIGNS) {
    const signSlug = slugify(sign.tr);

    buildDailyPages(sign, signSlug, latestDaily, archives.daily, dailyFiles, template);
    buildWeeklyPages(sign, signSlug, latestWeekly, archives.weekly, weeklyFiles, template);
    buildMonthlyPages(sign, signSlug, latestMonthly, archives.monthly, monthlyFiles, template);

    const signPageContent = buildSignIndexPage(sign, latestDaily, latestWeekly, latestMonthly);
    fs.writeFileSync(path.join(__dirname, '..', `${signSlug}.html`), signPageContent);
    console.log(`  Created ${signSlug}.html`);
  }

  buildSitemap();
  buildRobotsTxt();
  updateIndexHtml(latestDaily, latestWeekly, latestMonthly);

  console.log('All pages built successfully!');
}

function updateIndexHtml(latestDaily, latestWeekly, latestMonthly) {
  const indexPath = path.join(__dirname, '..', 'index.html');
  if (!fs.existsSync(indexPath)) return;

  let content = fs.readFileSync(indexPath, 'utf8');

  const dailyDate = latestDaily ? parseDateDisplay(latestDaily.date) : '';
  const weeklyDate = latestWeekly ? getWeekDisplay(latestWeekly.weekIso) : '';
  const monthlyDate = latestMonthly ? getMonthDisplay(`${latestMonthly.year}-${String(latestMonthly.monthNum).padStart(2, '0')}`) : '';

  content = content.replace(/<span id="date-daily">[^<]*<\/span>/, `<span id="date-daily">${dailyDate} için burç yorumlarınız</span>`);
  content = content.replace(/<span id="date-weekly">[^<]*<\/span>/, `<span id="date-weekly">${weeklyDate} için burç yorumlarınız</span>`);
  content = content.replace(/<span id="date-monthly">[^<]*<\/span>/, `<span id="date-monthly">${monthlyDate} için burç yorumlarınız</span>`);

  fs.writeFileSync(indexPath, content);
  console.log('Updated index.html with current dates');
}

function buildSignIndexPage(sign, latestDaily, latestWeekly, latestMonthly) {
  const signSlug = slugify(sign.tr);
  const otherSigns = ZODIAC_SIGNS
    .filter(s => s.id !== sign.id)
    .map(s => `<a href="/${slugify(s.tr)}.html" class="sign-mini">${s.symbol} ${s.tr}</a>`)
    .join('');

  const dailyDate = latestDaily ? parseDateDisplay(latestDaily.date) : '';
  const weeklyDate = latestWeekly ? getWeekDisplay(latestWeekly.weekIso) : '';
  const monthlyDate = latestMonthly ? getMonthDisplay(`${latestMonthly.year}-${String(latestMonthly.monthNum).padStart(2, '0')}`) : '';

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
        <a href="/${signSlug}-gunluk.html" class="period-btn">📅 Günlük Yorum ${dailyDate ? '(' + dailyDate + ')' : ''}</a>
        <a href="/${signSlug}-haftalik.html" class="period-btn">📆 Haftalık Yorum ${weeklyDate ? '(' + weeklyDate + ')' : ''}</a>
        <a href="/${signSlug}-aylik.html" class="period-btn">📆 Aylık Yorum ${monthlyDate ? '(' + monthlyDate + ')' : ''}</a>
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
  const rootDir = __dirname + '/..';
  const pages = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && !f.startsWith('index'));

  const urls = pages.map(page => {
    const url = page.replace('.html', '');
    const isDaily = page.includes('-gunluk');
    const isWeekly = page.includes('-haftalik');
    const isMonthly = page.includes('-aylik');
    return `  <url>
    <loc>${SITE_URL}/${url}</loc>
    <changefreq>${isDaily ? 'daily' : isWeekly ? 'weekly' : 'monthly'}</changefreq>
    <priority>${isDaily ? '0.9' : isWeekly ? '0.8' : '0.8'}</priority>
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