import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null

export async function saveAnalysis(userId, documentId, analysisResult) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase.from('analyses').insert([
    {
      user_id: userId,
      document_id: documentId,
      document_type: analysisResult.document_type,
      risk_score: analysisResult.risk_score,
      risk_score_num: analysisResult.risk_score_number,
      risk_reason: analysisResult.risk_reason,
      result_json: analysisResult,
      red_flag_count: analysisResult.red_flag_count || 0,
    },
  ])
  return { data, error }
}

export async function getUserAnalyses(userId) {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('analyses')
    .select('*, documents(filename, file_type, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function createDocument(userId, { filename, fileType, fileUrl, originalName, rawText, language }) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase.from('documents').insert([
    { user_id: userId, filename, file_type: fileType, file_url: fileUrl, original_name: originalName, raw_text: rawText, language },
  ]).select().single()
  return { data, error }
}

export async function getDocument(docId) {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase
    .from('documents')
    .select('*, analyses(*)')
    .eq('id', docId)
    .single()
  return { data, error }
}

export async function getUserDocuments(userId) {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('documents')
    .select('*, analyses(risk_score, risk_score_num, document_type)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function deleteDocument(docId) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('documents').delete().eq('id', docId)
  return { error }
}

export async function createReminder(userId, { documentId, obligationId, description, deadlineDate, isRecurring, recurringType }) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase.from('reminders').insert([
    { user_id: userId, document_id: documentId, obligation_id: obligationId, description, deadline_date: deadlineDate, is_recurring: isRecurring, recurring_type: recurringType },
  ]).select().single()
  return { data, error }
}

export async function getUserReminders(userId) {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('reminders')
    .select('*, documents(filename)')
    .eq('user_id', userId)
    .order('deadline_date', { ascending: true })
  return { data, error }
}

export async function deleteReminder(id) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { error } = await supabase.from('reminders').delete().eq('id', id)
  return { error }
}

export async function createShareLink(documentId, expiresAt = null) {
  if (!supabase) return { error: 'Supabase not configured' }
  const token = crypto.randomUUID()
  const { data, error } = await supabase.from('share_links').insert([
    { document_id: documentId, token, expires_at: expiresAt },
  ]).select().single()
  return { data, error }
}

export async function getShareLink(token) {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase
    .from('share_links')
    .select('*, documents(id, filename, raw_text, language, analyses(*))')
    .eq('token', token)
    .single()
  return { data, error }
}

export async function saveChatMessage(documentId, userId, role, content) {
  if (!supabase) return { error: 'Supabase not configured' }
  const { data, error } = await supabase.from('chat_messages').insert([
    { document_id: documentId, user_id: userId, role, content },
  ]).select().single()
  return { data, error }
}

export async function getChatMessages(documentId) {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: true })
  return { data, error }
}
