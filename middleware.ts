import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = [
    '/', 
    'requests',
    'overview', 
    'customers-reference',
    'payModes',
    'banks',
    'categories',
    'admin'
];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname

    const isProtectedRoute = protectedRoutes.includes(path) 
    || /^\/requests\/[a-zA-Z0-9\-]+$/.test(path) 
    || /^\/requests$/.test(path) 
    || /^\/overview$/.test(path) 
    || /^\/payModes$/.test(path) 
    || /^\/banks$/.test(path) 
    || /^\/categories$/.test(path) 
    || /^\/customers-reference$/.test(path)
    || /^\/admin$/.test(path)
    
    const isPublicRoute = publicRoutes.includes(path)

    // // 3. Decrypt the session from the cookie
    const cookie = cookies().get('access_token')?.value
    const refresh_cookie = cookies().get('refresh_token')?.value

    // const session = await decrypt(cookie)

    // // 5. Redirect to /login if the user is not authenticated && !session?.userId
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

// res.cookie("access_token", accessToken, accessTokenOptions);

// //parse environnement variables to integrate with fallback values
// const accessTokenExpire = parseInt(ACCESS_TOKEN_EXPIRE, 10);

// // Options for cookies 
// // The is a issue with timezone we add 1h (3600) from universal time
// export const accessTokenOptions: ITokenOptions = {
//     expires: new Date(Date.now() + (3600 + accessTokenExpire) * 1000 ),
//     maxAge: (3600 + accessTokenExpire) * 1000 ,
//     httpOnly: true,
//     sameSite: 'lax',
// }

/**
 * An Array of routes that are available to the public.
 * Theses routes do not require authentication  
 * @type {string[]}
 */
export const publicRoutes: string[] = [
    "/login",
];

/**
 * An Array of routes that are used for authentication
 * Theses routes will redirect logged un users to /settings
 * @type {string[]}
 */
export const authRoutes: string[] = [
    "/login",
    "/register",
];

/**
 * The prefix for API authentication reoutes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT_PATH = "/";
