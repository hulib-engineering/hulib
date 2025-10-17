import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { getToken } from 'next-auth/jwt';
import { AppConfig } from './utils/AppConfig';
import { Env } from '@/libs/Env.mjs';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

// const SUPPORTED_LOCALES = ['en', 'vi'];
const ADMIN_HOST = Env.ADMIN_HOST || 'admin.hulib.org';
const ADMIN_URL = `http://${ADMIN_HOST}:3000`; // ✅ always full URL for dev

export default async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0] || '';
  console.log('🌍 Hostname:', hostname);
  const url = request.nextUrl.clone();
  console.log('🔹 Pathname:', url.pathname);
  const parts = url.pathname.split('/').filter(Boolean);
  const [maybeLocale, _] = parts;
  const hasLocale = maybeLocale && AppConfig.locales.includes(maybeLocale);
  const locale = hasLocale ? maybeLocale : AppConfig.defaultLocale;
  const pathWithoutLocale = parts.slice(1).join('/') || '';

  // 🔒 Skip all API, static, NextAuth, and Auth routes completely
  if (
    url.pathname.startsWith('/api/auth')
    || url.pathname.startsWith('/auth')
    || url.pathname.startsWith('/_next')
    || url.pathname.startsWith('/.well-known')
    || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|map|json)$/)
  ) {
    return NextResponse.next();
  }

  // 🟢 Allow login pages (intlMiddleware only)
  if (/^\/(?:en|vi)?\/auth\/login\/?$/.test(url.pathname)) {
    const res = intlMiddleware(request);
    res.cookies.set('NEXT_LOCALE', locale);
    return res;
  }

  // Read NextAuth token (contains role + accessToken)
  const token = await getToken({ req: request, secret: Env.NEXTAUTH_SECRET });
  console.log('🔹 Token:', token);

  // 🔒 --- Common Guard: allow login pages to render freely ---
  // if (/^\/(vi|en)?\/auth\/login\/?$/.test(url.pathname) || url.pathname === '/auth/login') {
  //   console.log('🟢 Login route detected – running intlMiddleware only (no redirects)');
  //   // Force-set locale cookie so next-intl doesn't try to redirect
  //   const res = intlMiddleware(request);
  //   if (!request.cookies.get('NEXT_LOCALE')) {
  //     res.cookies.set('NEXT_LOCALE', locale);
  //   }
  //   return res;
  // }

  // 🟢 Admin subdomain logic
  if (hostname === ADMIN_HOST) {
    console.log('➡️ Entered ADMIN branch');

    // Prevent next-intl from overriding locale here
    // const response = NextResponse.next();
    // response.cookies.set('NEXT_LOCALE', locale);

    // 1️⃣ Allow the login page for admin
    // if (url.pathname.startsWith(`/${locale}/auth/login`)) {
    //   console.log('🟢 Admin login allowed');
    //   return intlMiddleware(request);
    // }

    // 2️⃣ Not logged in → go to admin login
    if (!token) {
      const isAuthRoute = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
      ].some(path => url.pathname.includes(path));

      if (isAuthRoute) {
        // Allow public access to these routes
        return intlMiddleware(request);
      }

      console.log('🚫 No token, redirecting to admin login');
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      // if (!request.nextUrl.pathname.includes('/auth/login')) {
      //   loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      // }
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3️⃣ Logged in but not admin → redirect to user app
    if (token.role !== 'Admin') {
      console.log('🚫 Non-admin role, redirecting to user app');
      const appUrl = Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      // Always redirect non-admins to main app
      return NextResponse.redirect(`${appUrl}/${locale}/home`);
    }

    // 4️⃣ Logged in admin → rewrite to /admin
    if (!url.pathname.startsWith(`/${locale}/admin`) && !url.pathname.startsWith(`/${locale}/auth/login`)) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/${locale}/admin/${pathWithoutLocale}`;
      console.log('🌀 Rewriting to:', rewriteUrl.pathname);
      const response = intlMiddleware(request);
      return NextResponse.rewrite(rewriteUrl, response);
    }

    return intlMiddleware(request);
  }

  if (hostname !== ADMIN_HOST) {
    console.log('➡️ Entered USER branch');

    // Publicly accessible auth routes
    const publicAuthRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
    ];

    const isPublicAuthRoute = publicAuthRoutes.some(path =>
      url.pathname.includes(path),
    );

    if (isPublicAuthRoute) {
      console.log('🟢 Public auth route, allowing access');
      const res = intlMiddleware(request);
      res.cookies.set('NEXT_LOCALE', locale);
      return res;
    }

    // Unauthenticated user → redirect to login
    if (!token) {
      console.log('🚫 No token — redirecting to login');
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in admin but on user site → redirect to admin
    if (token?.role === 'Admin' && hostname !== ADMIN_HOST) {
      console.log('🔁 Admin user detected, redirecting to admin site');
      return NextResponse.redirect(`${ADMIN_URL}/${locale}/home`);
    }

    // Default: allow user to continue
    return intlMiddleware(request);
  }

  return intlMiddleware(request);
}

export const config = {
  // matcher: [
  /*
   * Match all paths except for:
   * 1. /api routes
   * 2. /_next (Next.js internals)
   * 3. /_static (inside /public)
   * 4. all root files inside /public (e.g. /favicon.ico)
   */
  // '/((?!api/|_next/|_static/|_next/image|_vercel/|[\\w-]+\\.\\w+).*)',
  // ],
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
