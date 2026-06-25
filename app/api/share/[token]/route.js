import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppError, errorHandler } from '@/lib/errors'

export async function GET(request, { params }) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('share_links')
      .select('*, documents(id, filename, raw_text, language, analyses(*))')
      .eq('token', params.token)
      .single()

    if (error || !data) throw new AppError('Share link not found or expired', 404, 'NOT_FOUND')

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new AppError('Share link has expired', 410, 'EXPIRED')
    }

    const analysis = data.documents?.analyses?.[0]
    return NextResponse.json({
      filename: data.documents.filename,
      language: data.documents.language,
      analysis: analysis?.result_json || null,
    })
  } catch (error) {
    return errorHandler(error)
  }
}
