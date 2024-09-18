import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/', '/requests']
const publicRoutes = ['/login',]

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname

    const isProtectedRoute = protectedRoutes.includes(path) || /^\/requests\/[a-zA-Z0-9]+$/.test(path) 
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const cookie = cookies().get('access_token')?.value

    //const session = await decrypt(cookie)

    // 5. Redirect to /login if the user is not authenticated && !session?.userId
    if (isProtectedRoute && !cookie) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 6. Redirect to /dashboard if the user is authenticated
      if (
        isPublicRoute && 
        cookie
        //  session?.userId  &&
        // !req.nextUrl.pathname.startsWith('/dashboard')
      ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
      }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}