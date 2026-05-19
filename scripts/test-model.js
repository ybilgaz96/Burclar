const https = require('https');
const API_KEY = process.env.OPENCODE_API_KEY;

const args = process.argv.slice(2);
const model = args[0] || 'qwen3.6-plus';

const ZODIAC_SIGNS = [
  { id: 'aries', tr: 'Koç', en: 'Aries', symbol: '♈' },
  { id: 'taurus', tr: 'Boğa', en: 'Taurus', symbol: '♉' }
];

const SYSTEM_PROMPT = `Sen AstroOracle platformunun mistik astroloji asistanısın. Türkçe yaz.
Yanıtını şu formatta ver:

**Aşk:** [2-3 cümle]
**Kariyer & Para:** [2-3 cümle]
**Sağlık:** [2-3 cümle]
**Genel Enerji:** [2-3 cümle]
**Pratik Tavsiye:** [1 cümle]
**Şanslı Sayı:** X | **Şanslı Renk:** X | **Şanslı Gün:** X

150-200 kelime yaz.`;

async function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: `${SYSTEM_PROMPT}\n\n${prompt}` }],
      max_tokens: 800,
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

    console.log(`\n=== Testing model: ${model} ===\n`);

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          console.log('Response keys:', Object.keys(parsed));
          console.log('Model in response:', parsed.model);
          console.log('Finish reason:', parsed.choices?.[0]?.finish_reason);
          
          const message = parsed.choices?.[0]?.message || {};
          console.log('Message keys:', Object.keys(message));
          console.log('Role:', message.role);
          console.log('Has content?', !!message.content);
          console.log('Content length:', message.content ? message.content.length : 0);
          console.log('Has reasoning_content?', !!message.reasoning_content);
          
          if (message.content) {
            console.log('\n=== CONTENT (first 500 chars) ===');
            console.log(message.content.substring(0, 500));
            console.log('=== END CONTENT ===\n');
          }
          
          if (message.reasoning_content) {
            console.log('\n=== REASONING CONTENT (first 300 chars) ===');
            console.log(message.reasoning_content.substring(0, 300));
            console.log('=== END REASONING ===\n');
          }
          
          const content = message.content || message.reasoning_content || '';
          if (!content || content.length < 50) {
            console.log('❌ FAIL: Content is empty or too short');
            console.log('Full body:', body.substring(0, 1000));
          } else {
            console.log('✅ SUCCESS: Content received');
          }
          
          resolve({ success: !!content && content.length > 50, parsed });
        } catch (e) {
          console.log('❌ JSON parse error:', e.message);
          console.log('Body:', body.substring(0, 500));
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  if (!API_KEY) {
    console.error('OPENCODE_API_KEY not set');
    process.exit(1);
  }

  const sign = ZODIAC_SIGNS[0];
  const prompt = `${sign.tr} burcu için 19 Mayıs 2026 tarihine ait günlük yorum yaz. Aşk, kariyer, sağlık ve genel enerji konularında ayrı paragraflar halinde yaz.`;

  try {
    const result = await callAPI(prompt);
    process.exit(result.success ? 0 : 1);
  } catch (e) {
    process.exit(1);
  }
}

main();