import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimiter'
import { AppError, errorHandler } from '@/lib/errors'

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const rateKey = getRateLimitKey(request, user.id)
    const rateCheck = checkRateLimit(rateKey, 10)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`, code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter) } }
      )
    }

    const { documentText, language = 'English', documentId } = await request.json()

    if (!documentText || documentText.trim().length < 50) {
      throw new AppError('Document text is too short', 400, 'TEXT_TOO_SHORT')
    }

    const prompt = `You are a senior Indian legal expert. Analyze this legal document and return a concise JSON.
Respond in ${language} for explanation fields.
Return max 5 clauses, max 3 obligations, max 3 key amounts, max 3 key dates, max 3 suggested questions.
Keep all text explanations under 3 sentences each.

JSON structure:
{
  "document_type": "string",
  "risk_score": "Low" | "Medium" | "High",
  "risk_score_number": 0-100,
  "risk_reason": "short string",
  "simple_summary": "short string",
  "clauses": [{ "id": "string", "title": "string", "original_text": "string", "simple_explanation": "short string", "is_red_flag": boolean, "severity": "standard" | "review" | "red_flag" }],
  "obligations": [{ "description": "short string", "deadline": "string", "responsible_party": "string", "is_critical": boolean }],
  "key_amounts": [{ "label": "string", "amount": "string" }],
  "key_dates": [{ "label": "string", "date": "string" }],
  "your_rights": ["string"],
  "red_flag_count": number,
  "suggested_questions": ["string"]
}

Document:
${documentText}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, topP: 0.8, maxOutputTokens: 8192, response_mime_type: 'application/json' },
        }),
      }
    )

    const data = await response.json()
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const block = data.promptFeedback?.blockReason
      const msg = data.error?.message || data.candidates?.[0]?.finishReason || block || 'Unexpected response'
      console.error('Gemini API error:', JSON.stringify(data).substring(0, 2000))
      throw new AppError('AI analysis failed: ' + msg, 502, 'AI_ERROR')
    }
    const rawText = data.candidates[0].content.parts[0].text
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    let result
    try {
      result = JSON.parse(cleanText)
    } catch {
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new AppError('AI returned invalid JSON', 502, 'AI_PARSE_ERROR')
      try {
        result = JSON.parse(jsonMatch[0])
      } catch {
        console.error('Failed to parse Gemini JSON. First 1000 chars:', rawText.substring(0, 1000))
        throw new AppError('AI returned invalid JSON', 502, 'AI_PARSE_ERROR')
      }
    }

    if (documentId) {
      const admin = createAdminClient()
      const { error: upsertError } = await admin.from('analyses').upsert(
        {
          document_id: documentId,
          user_id: user.id,
          document_type: result.document_type,
          risk_score: result.risk_score,
          risk_score_num: result.risk_score_number,
          risk_reason: result.risk_reason,
          result_json: result,
          red_flag_count: result.red_flag_count || 0,
        },
        { onConflict: 'document_id' }
      )
      if (upsertError) {
        console.error('Failed to save analysis:', upsertError)
      }
    }

    return NextResponse.json({ ...result, id: documentId })
  } catch (error) {
    return errorHandler(error)
  }
}
