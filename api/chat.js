const OPENCODE_GO_ENDPOINT = "https://opencode.ai/zen/go/v1/chat/completions";

const rateLimits = new Map();

const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 10;

function getClientIP(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
         req.headers["x-real-ip"] ||
         req.socket?.remoteAddress ||
         "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const clientData = rateLimits.get(ip);

  if (!clientData) {
    rateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (now > clientData.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (clientData.count >= RATE_LIMIT_MAX) {
    return true;
  }

  clientData.count++;
  return false;
}

function cleanOldRateLimits() {
  const now = Date.now();
  for (const [ip, data] of rateLimits.entries()) {
    if (now > data.resetTime) {
      rateLimits.delete(ip);
    }
  }
}

setInterval(cleanOldRateLimits, RATE_LIMIT_WINDOW);

async function callAPI(prompt, model) {
  const response = await fetch(OPENCODE_GO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENCODE_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  let content = null;

  if (data.choices && data.choices[0] && data.choices[0].message) {
    content = data.choices[0].message.content;
  } else if (data.content && typeof data.content === "string") {
    content = data.content;
  } else if (data.content && data.content[0] && data.content[0].text) {
    content = data.content[0].text;
  } else if (typeof data === "string") {
    content = data;
  }

  if (!content) {
    throw new Error(`Unexpected response format: ${JSON.stringify(data).slice(0, 200)}`);
  }

  return content;
}

function validateInput(prompt, model) {
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return { valid: false, error: "Prompt is required" };
  }

  if (prompt.length > 2000) {
    return { valid: false, error: "Prompt too long (max 2000 characters)" };
  }

  const allowedModels = ["qwen3.6-plus", "qwen3.5-plus", "deepseek-v4-flash", "deepseek-v4-pro", "minimax-m2.7"];
  if (model && !allowedModels.includes(model)) {
    return { valid: false, error: "Invalid model specified" };
  }

  const badPatterns = [
    "ignore previous",
    "ignore instructions",
    "system prompt",
    "you are now",
    "pretend to be",
    "roleplay as"
  ];
  const lowerPrompt = prompt.toLowerCase();
  for (const pattern of badPatterns) {
    if (lowerPrompt.includes(pattern)) {
      return { valid: false, error: "Invalid prompt content" };
    }
  }

  return { valid: true };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIP = getClientIP(req);

  if (isRateLimited(clientIP)) {
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: 60
    });
  }

  const { prompt, model = "qwen3.5-plus", type } = req.body || {};

  const validation = validateInput(prompt, model);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  if (!process.env.OPENCODE_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const content = await callAPI(prompt, model);
    return res.status(200).json({ content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};