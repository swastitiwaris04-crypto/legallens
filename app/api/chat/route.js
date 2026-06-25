import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppError, errorHandler } from '@/lib/errors'

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { documentText, messages, language = 'English', documentId } = await request.json()

    if (documentId) {
      for (const msg of messages) {
        if (msg.role === 'user') {
          await supabase.from('chat_messages').insert({
            document_id: documentId,
            user_id: user.id,
            role: msg.role,
            content: msg.content,
          }).maybeSingle()
        }
      }
    }

    const conversationHistory = messages
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')

    const prompt = `You are a helpful Indian legal assistant. The user has uploaded a legal document and wants to ask questions about it. Answer clearly and simply in ${language}. Be direct, accurate, and helpful. Never give vague answers. If something is uncertain, say so.

Document:
${documentText}

Conversation so far:
${conversationHistory}

Answer the last user question helpfully and concisely.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    )

    const data = await response.json()
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini API error:', JSON.stringify(data))
      throw new AppError('AI response failed: ' + (data.error?.message || 'Unexpected response'), 502, 'AI_ERROR')
    }
    const answer = data.candidates[0].content.parts[0].text

    if (documentId) {
      await supabase.from('chat_messages').insert({
        document_id: documentId,
        user_id: user.id,
        role: 'assistant',
        content: answer,
      }).maybeSingle()
    }

    return NextResponse.json({ answer })
  } catch (error) {
    return errorHandler(error)
  }
}
