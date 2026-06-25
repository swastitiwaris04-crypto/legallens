import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@/lib/supabase/admin'
import { processFile, getFileType } from '@/lib/fileProcessor'
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

    const formData = await request.formData()
    const file = formData.get('file')
    const text = formData.get('text')
    const language = formData.get('language') || 'English'

    let rawText = text || ''
    let filename = 'Pasted text'
    let fileType = 'text'
    let fileUrl = null
    let originalName = null
    let fileBuffer = null

    if (file && file instanceof Blob) {
      fileBuffer = Buffer.from(await file.arrayBuffer())
      filename = file.name || 'uploaded_file'
      originalName = filename
      fileType = getFileType(file.type)

      const admin = createAdminClient()
      const filePath = `${user.id}/${crypto.randomUUID()}-${filename}`
      const { data: uploadData, error: uploadError } = await admin.storage
        .from('documents')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        })
      if (uploadError) throw new AppError('Failed to upload file', 500, 'UPLOAD_ERROR')
      fileUrl = uploadData.path

      rawText = await processFile(fileBuffer, file.type)
    }

    if (!rawText || rawText.trim().length < 50) {
      throw new AppError('Document text is too short. Please upload a longer document.', 400, 'TEXT_TOO_SHORT')
    }

    const { data: docData, error: docError } = await supabase.from('documents').insert([
      {
        user_id: user.id,
        filename,
        file_type: fileType,
        file_url: fileUrl,
        original_name: originalName,
        raw_text: rawText,
        language,
      },
    ]).select().single()

    if (docError) throw new AppError('Failed to create document record', 500, 'DB_ERROR')

    return NextResponse.json({
      id: docData.id,
      filename,
      fileType,
      rawText,
      language,
      message: 'Document uploaded successfully. Proceed to analysis.',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

export async function GET(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { data, error } = await supabase
      .from('documents')
      .select('*, analyses(risk_score, risk_score_num, document_type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw new AppError('Failed to fetch documents', 500, 'DB_ERROR')

    return NextResponse.json({ documents: data })
  } catch (error) {
    return errorHandler(error)
  }
}
