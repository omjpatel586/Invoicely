import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// import { getAuthToken } from "./libs/auth"; 

export async function middleware(request: NextRequest) {
  // 1. Get the current URL path
  const path = request.nextUrl.pathname;

  // 2. Define your public routes (routes that don't need a token)
  const isPublicPath = path === '/auth/signin';

  // 3. Get the token 
  // Pro-tip: Middleware runs on the Edge Runtime, so complex Node.js DB calls in getAuthToken() might fail.
  // It is usually safer to just read the cookie directly from the request:
  const token = request.cookies.get('invoicelyAppAuthToken')?.value || '';

  // Alternatively, if your getAuthToken is Edge-compatible, you can still use it:
  // const token = await getAuthToken();

  // 4. Logic: No token + trying to access protected route -> send to signin
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // 5. Logic: Has token + trying to access signin page -> send to dashboard/home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard/companies', request.url));
  }

  // 6. If everything is fine, let the request continue
  return NextResponse.next();
}

// 7. MUST HAVE: The matcher configuration
// This tells Next.js NOT to run middleware on static files, images, or API routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};