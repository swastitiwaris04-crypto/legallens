import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppError, errorHandler } from '@/lib/errors'

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { documentId, expiresInDays } = await request.json()
    if (!documentId) throw new AppError('documentId is required', 400, 'VALIDATION_ERROR')

    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('user_id')
      .eq('id', documentId)
      .single()

    if (docError || !doc) throw new AppError('Document not found', 404, 'NOT_FOUND')
    if (doc.user_id !== user.id) throw new AppError('Access denied', 403, 'FORBIDDEN')

    const token = crypto.randomUUID()
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null

    const { data, error } = await supabase.from('share_links').insert([
      { document_id: documentId, token, expires_at: expiresAt },
    ]).select().single()

    if (error) throw new AppError('Failed to create share link', 500, 'DB_ERROR')

    const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin')}/api/share/${token}`
    return NextResponse.json({ token, shareUrl, expiresAt })
  } catch (error) {
    return errorHandler(error)
  }
}
