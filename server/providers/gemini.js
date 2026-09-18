// server/providers/gemini.js
// Google Gemini API provider integration for Nikhil AI Studio

export async function callGemini(systemInstruction, userPrompt, apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }

  // Use Gemini 2.5 Flash / 1.5 Flash via REST API
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemInstruction}\n\nUser Request: ${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error [${response.status}]: ${errorText}`);
  }

  const result = await response.json();
  const candidate = result.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text || '';

  return {
    success: true,
    text,
    model: model,
    provider: 'gemini'
  };
}
