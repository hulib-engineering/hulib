import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from './utils/AppConfig';

import { Env } from '@/libs/Env.mjs';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  defaultLocale: AppConfig.defaultLocale,
  localePrefix: AppConfig.localePrefix,
  localeDetection: false, // Disable browser-based locale detection
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, Next.js internals, and static files
  if (
    pathname.startsWith('/api')
    || pathname.startsWith('/_next')
    || pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|map|json)$/)
  ) {
    return NextResponse.next();
  }

  // Get session token
  const token = await getToken({ req: request, secret: Env.NEXTAUTH_SECRET });

  // Let next-intl handle locale
  const response = intlMiddleware(request);

  // Determine a normalized path (strip locale if present)
  const parts = pathname.split('/').filter(Boolean);
  const normalizedPath
    = parts.length > 0 && AppConfig.locales.includes(parts[0]!)
      ? `/${parts.slice(1).join('/')}`
      : pathname;

  // Public routes
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/admin/auth/login',
  ];
  const isPublic = publicRoutes.some(
    route => normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  );
  if (isPublic) {
    return response;
  }

  const isAdminPage = pathname.includes('/admin');
  const loginPath = isAdminPage ? '/admin/auth/login' : '/auth/login';

  // Not logged in → redirect to the right login
  if (!token) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // Role checks
  const isAdmin = token.role === 'Admin';

  if (!isAdmin && isAdminPage) {
    return NextResponse.redirect(new URL('/admin/auth/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
