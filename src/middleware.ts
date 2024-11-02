import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
  // localeDetection: false,
});

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Rewrites URL
  const [, locale, ...segments] = request.nextUrl.pathname.split('/');

  if (locale != null && segments.join('/') === 'profile') {
    const usesNewProfile =
      (request.cookies.get('NEW_PROFILE')?.value || 'false') === 'true';

    if (usesNewProfile) {
      request.nextUrl.pathname = `/${locale}/profile/new`;
    }
  }

  return response;
}

// export default intlMiddleware;
// export default authMiddleware({
//   publicRoutes: (req: NextRequest) =>
//     !req.nextUrl.pathname.includes('/dashboard'),
//
//   beforeAuth: (req) => {
//     // Execute next-intl middleware before Clerk's auth middleware
//     return intlMiddleware(req);
//   },
//
//   // eslint-disable-next-line consistent-return
//   afterAuth(auth, req) {
//     // Handle users who aren't authenticated
//     if (!auth.userId && !auth.isPublicRoute) {
//       return redirectToSignIn({ returnBackUrl: req.url });
//     }
//   },
// });

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
