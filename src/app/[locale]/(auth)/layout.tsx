// import { enUS, frFR } from '@clerk/localizations';
// import { ClerkProvider } from '@clerk/nextjs';

import type { ReactNode } from 'react';

export default function AuthLayout({
  children, // will be a page or nested layout
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // let clerkLocale = enUS;
  // let signInUrl = '/sign-in';
  // let signUpUrl = '/sign-up';
  // let dashboardUrl = '/dashboard';

  if (locale === 'vi') {
    // clerkLocale = frFR;
  }

  // if (locale !== 'en') {
  //   signInUrl = `/${locale}${signInUrl}`;
  //   signUpUrl = `/${locale}${signUpUrl}`;
  //   dashboardUrl = `/${locale}${dashboardUrl}`;
  // }

  return children;
}
