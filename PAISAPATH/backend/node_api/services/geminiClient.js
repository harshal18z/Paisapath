// backend/node_api/services/geminiClient.js
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/gemini-1.5-mini';

// OpenAI-compatible “generativelanguage” base for many Gemini integrations.
// We POST to the OpenAI-compatible chat completions path used by Google.
const OPENAI_COMPAT_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';
const CHAT_COMPLETIONS_PATH = '/chat/completions';

if (!GEMINI_API_KEY) {
  console.warn(
    '[geminiClient] Warning: GEMINI_API_KEY is not set. AI calls will fail until you set GEMINI_API_KEY in your environment.'
  );
}

/**
 * Send a chat prompt to Gemini (via Google's Generative Language OpenAI-compatible path).
 * - prompt: string user prompt
 * - userContext: optional object with additional context you want to forward to the model
 *
 * NOTE: Set GEMINI_API_KEY in your environment. Optionally set GEMINI_MODEL.
 */
async function sendChatPrompt(prompt, userContext = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'Gemini API key not configured. Set GEMINI_API_KEY in your environment (backend/.env or process env).'
    );
  }

  try {
    // Build messages array in OpenAI / Chat Completions style
    const messages = [
      { role: 'system', content: 'You are a helpful AI financial coach.' },
      { role: 'user', content: prompt }
    ];

    // Include user context as system instructions (if provided)
    if (userContext && Object.keys(userContext).length > 0) {
      messages.unshift({
        role: 'system',
        content: `User context (do not reveal): ${JSON.stringify(userContext)}`
      });
    }

    const url = `${OPENAI_COMPAT_BASE}${CHAT_COMPLETIONS_PATH}`;

    const payload = {
      model: GEMINI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 800
    };

    const res = await axios.post(url, payload, {
      timeout: 25000,
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Response shape may vary; OpenAI-compatible endpoints normally put text: choices[0].message.content
    if (res.data) {
      // Try OpenAI-compatible shape first:
      if (res.data.choices && res.data.choices.length > 0 && res.data.choices[0].message) {
        return res.data.choices[0].message.content;
      }
      // Some Google responses may put text differently:
      if (res.data.output?.[0]?.content?.[0]?.text) {
        return res.data.output[0].content[0].text;
      }
      // fallback: return entire body
      return res.data;
    }

    throw new Error('Gemini returned unexpected response structure');
  } catch (err) {
    // Normalize errors to be helpful in dev
    const remote = err.response?.data || err.response?.statusText || err.message;
    console.error('[geminiClient] Error calling Gemini:', remote);
    throw new Error(`Gemini API error: ${remote}`);
  }
}

module.exports = { sendChatPrompt };

