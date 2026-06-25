import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppError, errorHandler } from '@/lib/errors'

export async function DELETE(request, { params }) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { data: reminder, error: fetchError } = await supabase
      .from('reminders')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !reminder) throw new AppError('Reminder not found', 404, 'NOT_FOUND')
    if (reminder.user_id !== user.id) throw new AppError('Access denied', 403, 'FORBIDDEN')

    const { error } = await supabase.from('reminders').delete().eq('id', params.id)
    if (error) throw new AppError('Failed to delete reminder', 500, 'DB_ERROR')

    return NextResponse.json({ message: 'Reminder deleted successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}
