import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default async function middleware(request: NextRequest) {
  // const url = request.nextUrl.clone();
  // const hostname = request.nextUrl.hostname;
  const parts = request.nextUrl.pathname.split('/').filter(Boolean);
  const [maybeLocale, ...rest] = parts;

  const supportedLocales = ['en', 'vi']; // adjust to your project
  const hasLocale = maybeLocale && supportedLocales.includes(maybeLocale);
  const locale = hasLocale ? maybeLocale : null;
  const segments = hasLocale ? rest : parts;
  //
  // // Admin subdomain handling
  // if (hostname.startsWith('admin.')) {
  //   // If locale is present
  //   if (locale) {
  //     url.pathname = `/${locale}/admin/${rest}`;
  //   } else {
  //     url.pathname = `/admin/${rest}`;
  //   }
  //
  //   return NextResponse.rewrite(url);
  // }

  const response = intlMiddleware(request);

  // Rewrites URL
  if (locale != null && segments.join('/') === 'profile') {
    const usesNewProfile
      = (request.cookies.get('NEW_PROFILE')?.value || 'false') === 'true';

    if (usesNewProfile) {
      request.nextUrl.pathname = `/${locale}/profile/new`;
    }
  }

  // --- Admin handling ---
  // if ((locale && segments[0] === 'admin') || (!locale && parts[0] === 'admin')) {
  //   const token = await getToken({ req: request, secret: Env.NEXTAUTH_SECRET });
  //
  //   if (token?.role === 'Admin') {
  //     // ✅ If already on admin.localhost → allow
  //     if (hostname === 'admin.localhost') {
  //       return response;
  //     }
  //
  //     // ✅ Otherwise redirect to admin.localhost
  //     const url = request.nextUrl.clone();
  //     url.hostname = 'admin.localhost';
  //
  //     if (locale) {
  //       url.pathname = `/${locale}/${segments.slice(1).join('/')}`;
  //     } else {
  //       url.pathname = `/${parts.slice(1).join('/')}`;
  //     }
  //
  //     return NextResponse.redirect(url);
  //   }
  //
  //   // ❌ Not admin → redirect to log in
  //   const loginPath = locale ? `/${locale}/auth/login` : `/auth/login`;
  //   return NextResponse.redirect(new URL(loginPath, request.url));
  // }

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
