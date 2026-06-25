import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppError, errorHandler } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new AppError('Authentication required', 401, 'UNAUTHORIZED')

    const { data: docCount } = await supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { data: analysisCount } = await supabase
      .from('analyses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || '',
        avatar: user.user_metadata?.avatar_url || null,
      },
      stats: {
        documents: docCount?.length || 0,
        analyses: analysisCount?.length || 0,
      },
    })
  } catch (error) {
    return errorHandler(error)
  }
}
