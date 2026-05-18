const https = require('https');

const API_KEY = process.env.OPENCODE_API_KEY;
const MODEL = process.argv[2] || 'deepseek-v4-flash';

if (!API_KEY) {
  console.error('OPENCODE_API_KEY not set');
  console.log('Usage: node scripts/test-api.js [model]');
  console.log('Example: node scripts/test-api.js deepseek-v4-flash');
  process.exit(1);
}

console.log('=== API Test ===');
console.log('Model:', MODEL);
console.log('API Key length:', API_KEY.length);
console.log('API Key prefix:', API_KEY.substring(0, 8) + '...');
console.log('');

const prompt = 'Merhaba! Kısaca Türkçe yanıt ver, 10 kelime.';

const data = JSON.stringify({
  model: MODEL,
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 50,
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

console.log('Request:', { model: MODEL, prompt: prompt.substring(0, 50) });
console.log('');

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);

    if (res.statusCode !== 200) {
      try {
        const err = JSON.parse(body);
        console.log('Error type:', err.error?.type);
        console.log('Error code:', err.error?.code);
        console.log('Error message:', err.error?.message);
      } catch (e) {
        console.log('Could not parse error response');
      }
      process.exit(1);
    }

    try {
      const parsed = JSON.parse(body);
      console.log('Success! Response:', parsed.choices?.[0]?.message?.content);
    } catch (e) {
      console.log('Could not parse success response');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();

console.log('Request sent, waiting for response...');