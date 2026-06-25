import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@/lib/supabase/admin'
import { AppError, errorHandler } from '@/lib/errors'

export async function GET(request, { params }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { data, error } = await supabase
      .from('documents')
      .select('*, analyses(*)')
      .eq('id', params.id)
      .single()

    if (error || !data) throw new AppError('Document not found', 404, 'NOT_FOUND')
    if (data.user_id !== user.id) throw new AppError('Access denied', 403, 'FORBIDDEN')

    return NextResponse.json({ document: data })
  } catch (error) {
    return errorHandler(error)
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !doc) throw new AppError('Document not found', 404, 'NOT_FOUND')
    if (doc.user_id !== user.id) throw new AppError('Access denied', 403, 'FORBIDDEN')

    if (doc.file_url) {
      const admin = createAdminClient()
      await admin.storage.from('documents').remove([doc.file_url])
    }

    const { error: deleteError } = await supabase.from('documents').delete().eq('id', params.id)
    if (deleteError) throw new AppError('Failed to delete document', 500, 'DB_ERROR')

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}
