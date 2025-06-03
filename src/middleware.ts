import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    console.log("req.nextauth.token", req.nextauth.token)
    
    if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/dashboard/products' )) {
      if (token?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
     if (req.nextUrl.pathname.startsWith('/dashboard/clients')) {
      if (token?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!req.nextUrl.pathname.startsWith('/dashboard')) {
          return true
        }
        return !!token
      }
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}