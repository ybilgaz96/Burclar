const OPENCODE_GO_ENDPOINT = "https://opencode.ai/zen/go/v1/chat/completions";
const ANTHROPIC_ENDPOINT = "https://opencode.ai/zen/go/v1/messages";

const MODEL_CONFIG = {
  "deepseek-v4-pro": {
    endpoint: OPENCODE_GO_ENDPOINT,
    modelId: "deepseek-v4-pro",
    provider: "openai-compatible",
    systemPrompt: true
  },
  "deepseek-v4-flash": {
    endpoint: OPENCODE_GO_ENDPOINT,
    modelId: "deepseek-v4-flash",
    provider: "openai-compatible",
    systemPrompt: true
  }
};

const SYSTEM_PROMPT = `Sen AstroOracle platformunun mistik astroloji asistanısın. Türkçe veya İngilizce yaz (kullanıcının diline göre). Mistik, sıcak, umut verici ama gerçekçi bir dil kullan. Asla kesin tahminler yapma, rehberlik sun. Her yorumda pratik bir tavsiye ekle. Yanıtları format: önce enerji özeti, sonra kategoriler, son tavsiye. Emojileri ölçülü kullan (paragraf başına 1).`;

const inMemoryCache = new Map();

function getCacheKey(prompt, model) {
  return `${model}:${prompt.slice(0, 100)}`;
}

function getFromMemoryCache(key) {
  const cached = inMemoryCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
    inMemoryCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function saveToMemoryCache(key, data) {
  inMemoryCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

async function callOpenCodeGoAPI(prompt, model, type) {
  const config = MODEL_CONFIG[model] || MODEL_CONFIG["deepseek-v4-flash"];
  const cacheKey = getCacheKey(prompt, model);
  
  const cached = getFromMemoryCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  const fullPrompt = type === "oracle" ? prompt : `${SYSTEM_PROMPT}\n\n${prompt}`;
  
  const requestBody = {
    model: config.modelId,
    messages: [
      { role: "user", content: fullPrompt }
    ],
    max_tokens: type === "oracle" ? 300 : 800,
    temperature: 0.7
  };
  
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENCODE_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", response.status, errorText);
    throw new Error(`API call failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  let content;
  if (data.choices && data.choices[0] && data.choices[0].message) {
    content = data.choices[0].message.content;
  } else if (data.content) {
    content = data.content;
  } else {
    console.error("Unexpected response format:", data);
    throw new Error("Unexpected response format");
  }
  
  saveToMemoryCache(cacheKey, content);
  
  return content;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { prompt, model = "deepseek-v4-flash", type = "horoscope" } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  
  if (!process.env.OPENCODE_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }
  
  try {
    const content = await callOpenCodeGoAPI(prompt, model, type);
    
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json({ content });
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Failed to get response" });
  }
};