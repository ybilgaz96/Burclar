const OPENCODE_GO_ENDPOINT = "https://opencode.ai/zen/go/v1/chat/completions";

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
  } else if (data.content && typeof data.content === 'string') {
    content = data.content;
  } else if (data.content && data.content[0] && data.content[0].text) {
    content = data.content[0].text;
  } else if (typeof data === 'string') {
    content = data;
  }
  
  if (!content) {
    throw new Error(`Unexpected response format: ${JSON.stringify(data).slice(0, 200)}`);
  }
  
  return content;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, model = "qwen3.5-plus", type } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
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