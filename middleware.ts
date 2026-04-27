import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const ADMIN_ROUTES = ['/admin']
const PROTECTED_ROUTES = ['/orders', '/checkout']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth-token')?.value

  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))

  if (!isAdminRoute && !isProtected) return NextResponse.next()

  const payload = token ? verifyToken(token) : null

  if (!payload) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
  }

  if (isAdminRoute && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout/:path*'],
}
