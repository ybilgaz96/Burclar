const https = require('https');
const fs = require('fs');
const path = require('path');

const OPENCODE_GO_ENDPOINT = 'https://opencode.ai/zen/go/v1/chat/completions';
const API_KEY = process.env.OPENCODE_API_KEY;

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

const SYSTEM_PROMPT = `Sen AstroOracle platformunun mistik astroloji asistanısın. Türkçe yaz. Mistik, sıcak, umut verici ama gerçekçi bir dil kullan. Asla kesin tahminler yapma, rehberlik sun. Her yorumda pratik bir tavsiye ekle. Şanslı sayı, renk ve günü de belirt. 150-200 kelime.`;

async function callAPI(prompt, retryCount = 0) {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  console.log(`    [DEBUG] API Key: ${API_KEY ? 'SET (len=' + API_KEY.length + ', prefix=' + API_KEY.substring(0, 6) + '...)' : 'NOT SET'}`);
  console.log(`    [DEBUG] Model: deepseek-v4-flash`);
  console.log(`    [DEBUG] Attempt: ${retryCount + 1}/3`);

  if (retryCount > 0) {
    console.log(`    [DEBUG] Waiting ${Math.min(1000 * Math.pow(2, retryCount), 30000)}ms before retry...`);
    await delay(Math.min(1000 * Math.pow(2, retryCount), 30000));
  }

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: `${SYSTEM_PROMPT}\n\n${prompt}` }],
      max_tokens: 600,
      temperature: 0.7
    });

    const options = {
      hostname: 'opencode.ai',
      port: 443,
      path: '/zen/go/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const debugFile = '/tmp/api_response.json';
        require('fs').writeFileSync(debugFile, JSON.stringify({statusCode: res.statusCode, body: body}, null, 2));

        if (res.statusCode === 429) {
          if (retryCount < 3) {
            console.log(`    Rate limited, retrying in ${Math.min(1000 * Math.pow(2, retryCount), 30000)}ms...`);
            return callAPI(prompt, retryCount + 1).then(resolve).catch(reject);
          }
          reject(new Error(`API Error 429: Rate limit exceeded after 3 retries`));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`API Error ${res.statusCode}: ${body}`));
          return;
        }
        try {
          const parsed = JSON.parse(body);
          const content = parsed.choices?.[0]?.message?.content
            || parsed.content
            || parsed.output
            || parsed.choices?.[0]?.text
            || parsed.choices?.[0]?.message?.reasoning_content
            || parsed.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments
            || parsed.reasoning; // DeepSeek reasoning field
          if (!content) {
            process.stdout.write('    [DEBUG] No content - full response in /tmp/api_response.json\n');
            process.stdout.write('    [DEBUG] Response keys: ' + Object.keys(parsed).join(', ') + '\n');
            process.stdout.write('    [DEBUG] Body: ' + body.substring(0, 500) + '\n');
            reject(new Error('No content in API response'));
            return;
          }
          resolve(content);
        } catch (e) {
          process.stdout.write('    [DEBUG] JSON parse error: ' + e.message + '\n');
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDailyPrompt(sign, date) {
  const dateStr = new Date(date).toLocaleDateString('tr-TR');
  return `${sign.tr} burcu için ${dateStr} tarihine ait günlük yorum yaz. Aşk, kariyer, sağlık ve genel enerji konularında ayrı paragraflar halinde, mistik ama pratik bir dil kullan. Şanslı sayı, renk ve günü de belirt.`;
}

function getWeeklyPrompt(sign, weekStart, weekEnd) {
  return `${sign.tr} burcu için ${weekStart} - ${weekEnd} haftasına ait haftalık astroloji yorumu yaz. Haftanın genel teması, önemli gezegen geçişleri ve pratik tavsiyeler içersin. 300-400 kelime.`;
}

function getMonthlyPrompt(sign, month, year) {
  const monthName = new Date(year, month).toLocaleDateString('tr-TR', { month: 'long' });
  return `${sign.tr} burcu için ${monthName} ${year} ayına ait aylık astroloji yorumu yaz. Ay boyunca önemli astrolojik olayları, temaları ve tavsiyeleri içersin. 400-500 kelime.`;
}

function getLuckyInfo(text) {
  const numberMatch = text.match(/\d+/);
  const colors = ['kırmızı', 'mavi', 'yeşil', 'mor', 'altın', 'pembe', 'turuncu', 'lacivert'];
  const colorMatch = colors.find(c => text.toLowerCase().includes(c)) || 'mor';
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const dayMatch = days.find(d => text.toLowerCase().includes(d.toLowerCase())) || 'Cuma';

  return {
    number: numberMatch ? parseInt(numberMatch[0]) : Math.floor(Math.random() * 99) + 1,
    color: colorMatch.charAt(0).toUpperCase() + colorMatch.slice(1),
    day: dayMatch
  };
}

function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toLocaleDateString('tr-TR'),
    end: end.toLocaleDateString('tr-TR')
  };
}

async function generateHoroscopes() {
  console.log('[START] Starting horoscope generation...');
  console.log('[START] API_KEY status:', API_KEY ? `SET (len=${API_KEY.length})` : 'NOT SET');

  if (!API_KEY) {
    console.error('[ERROR] OPENCODE_API_KEY environment variable is not set');
    process.exit(1);
  }

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const weekRange = getWeekRange(today);
  const month = today.getMonth();
  const year = today.getFullYear();
  const monthName = today.toLocaleDateString('tr-TR', { month: 'long' });

  console.log(`Generating horoscopes for ${dateStr}...`);
  console.log(`Week: ${weekRange.start} - ${weekRange.end}`);
  console.log(`Month: ${monthName} ${year}`);

  const data = {
    generatedAt: new Date().toISOString(),
    date: dateStr,
    weekRange: weekRange,
    month: { name: monthName, year: year },
    daily: {},
    weekly: {},
    monthly: {}
  };

  for (const sign of ZODIAC_SIGNS) {
    console.log(`\nProcessing ${sign.tr}...`);

    console.log('  - Daily...');
    const dailyContent = await callAPI(getDailyPrompt(sign, today));
    data.daily[sign.id] = {
      name: sign.tr,
      symbol: sign.symbol,
      content: dailyContent,
      lucky: getLuckyInfo(dailyContent)
    };

    console.log('  - Weekly...');
    const weeklyContent = await callAPI(getWeeklyPrompt(sign, weekRange.start, weekRange.end));
    data.weekly[sign.id] = {
      name: sign.tr,
      symbol: sign.symbol,
      content: weeklyContent,
      lucky: getLuckyInfo(weeklyContent)
    };

    console.log('  - Monthly...');
    const monthlyContent = await callAPI(getMonthlyPrompt(sign, month, year));
    data.monthly[sign.id] = {
      name: sign.tr,
      symbol: sign.symbol,
      content: monthlyContent,
      lucky: getLuckyInfo(monthlyContent)
    };

    if (sign !== ZODIAC_SIGNS[ZODIAC_SIGNS.length - 1]) {
      console.log('  Waiting 3 seconds before next sign...');
      await sleep(3000);
    }
  }

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, `${dateStr}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`\nSaved to ${filePath}`);

  return data;
}

generateHoroscopes().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});