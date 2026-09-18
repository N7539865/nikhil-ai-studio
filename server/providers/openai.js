// server/providers/openai.js
// OpenAI / OpenRouter API provider integration for Nikhil AI Studio

export async function callOpenAI(systemInstruction, userPrompt, apiKey, baseURL = 'https://api.openai.com/v1') {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured in environment.');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const url = `${baseURL.replace(/\/+$/, '')}/chat/completions`;

  const payload = {
    model: model,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2048,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error [${response.status}]: ${errorText}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content || '';

  return {
    success: true,
    text,
    model: model,
    provider: 'openai'
  };
}
