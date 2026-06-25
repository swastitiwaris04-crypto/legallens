const requestCounts = new Map()

export function checkRateLimit(key, maxRequests = 10, windowMs = 3600000) {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now - record.start > windowMs) {
    requestCounts.set(key, { start: now, count: 1 })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((windowMs - (now - record.start)) / 1000)
    return { allowed: false, remaining: 0, retryAfter }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

export function getRateLimitKey(request, userId = null) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  return userId ? `user:${userId}` : `ip:${ip}`
}
