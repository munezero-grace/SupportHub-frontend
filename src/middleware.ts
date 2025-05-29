import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/dashboard/products') && req.nextauth.token?.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}