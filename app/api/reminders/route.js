import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppError, errorHandler } from '@/lib/errors'

export async function GET(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { data, error } = await supabase
      .from('reminders')
      .select('*, documents(filename)')
      .eq('user_id', user.id)
      .order('deadline_date', { ascending: true })

    if (error) throw new AppError('Failed to fetch reminders', 500, 'DB_ERROR')
    return NextResponse.json({ reminders: data })
  } catch (error) {
    return errorHandler(error)
  }
}

export async function POST(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const body = await request.json()
    const { documentId, obligationId, description, deadlineDate, isRecurring, recurringType } = body

    if (!description) throw new AppError('Description is required', 400, 'VALIDATION_ERROR')

    const { data, error } = await supabase.from('reminders').insert([
      {
        user_id: user.id,
        document_id: documentId,
        obligation_id: obligationId,
        description,
        deadline_date: deadlineDate || null,
        is_recurring: isRecurring || false,
        recurring_type: recurringType || null,
      },
    ]).select().single()

    if (error) throw new AppError('Failed to create reminder', 500, 'DB_ERROR')
    return NextResponse.json({ reminder: data }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
