module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chartSummary, cardType, language } = req.body || {};
  const lang = language === 'zh' ? 'zh' : 'en';

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const langInstruction = lang === 'zh'
    ? 'Respond entirely in Traditional Chinese (繁體中文).'
    : 'Respond in English.';

  const systemPrompt = `You are a master Bazi astrologer with decades of experience reading the Four Pillars of Destiny. You give live, personal interpretations as a wise human fortune teller — direct, insightful, and deeply personal. Never mention AI, Claude, algorithms, or phrases like "based on your data". Speak as if you have studied this person's chart for years. ${langInstruction}`;

  const cardInstructions = cardType === 'overview'
    ? 'Provide a narrative introduction to this person\'s chart, then cover four aspects in order: Career & Purpose, Relationships & Love, Health & Vitality, Wealth & Resources. Each aspect should be 2-3 sentences.'
    : `Provide one focused, insightful paragraph about the "${cardType}" aspect of this person\'s chart.`;

  const userMessage = `Here is the Bazi chart data:\n${JSON.stringify(chartSummary, null, 2)}\n\n${cardInstructions}`;

  const requestBody = JSON.stringify({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 600,
    stream: true,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  });

  let claudeRes;
  try {
    claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: requestBody
    });
  } catch (err) {
    res.write('data: ' + JSON.stringify({ error: 'Reading unavailable' }) + '\n\n');
    return res.end();
  }

  if (!claudeRes.ok) {
    res.write('data: ' + JSON.stringify({ error: 'Reading unavailable' }) + '\n\n');
    return res.end();
  }

  const reader = claudeRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete last line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (!raw || raw === '[DONE]') continue;

        let parsed;
        try { parsed = JSON.parse(raw); } catch { continue; }

        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          res.write('data: ' + JSON.stringify({ token: parsed.delta.text }) + '\n\n');
        } else if (parsed.type === 'message_stop') {
          res.write('data: [DONE]\n\n');
          return res.end();
        }
      }
    }
  } catch (err) {
    res.write('data: ' + JSON.stringify({ error: 'Reading unavailable' }) + '\n\n');
    return res.end();
  }

  // Fallback end if message_stop was not received
  res.write('data: [DONE]\n\n');
  res.end();
};
