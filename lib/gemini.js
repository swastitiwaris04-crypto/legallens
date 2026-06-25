const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function analyzeDocument(documentText, language = 'English') {
  const prompt = `You are a senior Indian legal expert helping common people understand legal documents.
Analyze the following legal document thoroughly and respond ONLY with a valid JSON object.
Respond in ${language} language for the explanation fields.

Return this exact JSON structure (no markdown, no backticks, just raw JSON):
{
  "document_type": "string",
  "risk_score": "Low" | "Medium" | "High",
  "risk_score_number": number between 0-100,
  "risk_reason": "string",
  "simple_summary": "string",
  "key_facts": [{ "label": "string", "value": "string" }],
  "clauses": [{
    "id": "string",
    "title": "string",
    "original_text": "string",
    "simple_explanation": "string",
    "is_red_flag": boolean,
    "red_flag_reason": "string",
    "severity": "standard" | "review" | "red_flag",
    "your_rights": "string or null"
  }],
  "obligations": [{
    "id": "string",
    "description": "string",
    "deadline": "string",
    "responsible_party": "string",
    "is_critical": boolean
  }],
  "key_amounts": [{ "label": "string", "amount": "string" }],
  "key_dates": [{ "label": "string", "date": "string" }],
  "your_rights": ["string"],
  "red_flag_count": number,
  "suggested_questions": ["string"]
}

Document to analyze:
${documentText}`;

  const response = await fetch(`${MODEL_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, topP: 0.8, maxOutputTokens: 8192 },
    }),
  });

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  const cleanText = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanText);
}

export async function chatWithDocument(documentText, messages, language = 'English') {
  const conversationHistory = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `You are a helpful Indian legal assistant. Answer clearly and simply in ${language}.
Document:
${documentText}
Conversation:
${conversationHistory}
Answer the last user question helpfully and concisely.`;

  const response = await fetch(`${MODEL_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
