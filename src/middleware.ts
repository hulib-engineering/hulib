import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Rewrites URL
  const [, locale, ...segments] = request.nextUrl.pathname.split('/');

  if (locale != null && segments.join('/') === 'profile') {
    const usesNewProfile
      = (request.cookies.get('NEW_PROFILE')?.value || 'false') === 'true';

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
//     // Execute next-intl middleware before Clerk's profile middleware
//     return intlMiddleware(req);
//   },
//
//   // eslint-disable-next-line consistent-return
//   afterAuth(profile, req) {
//     // Handle users who aren't authenticated
//     if (!profile.userId && !profile.isPublicRoute) {
//       return redirectToSignIn({ returnBackUrl: req.url });
//     }
//   },
// });

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
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};
