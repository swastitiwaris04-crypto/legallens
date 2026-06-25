import { NextResponse } from 'next/server'

export class AppError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message)
    this.status = status
    this.code = code
  }
}

export function errorHandler(error) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    )
  }

  console.error('Unhandled error:', error)
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}

export function requireAuth(supabase) {
  return async (request) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED')
    }
    return user
  }
}
