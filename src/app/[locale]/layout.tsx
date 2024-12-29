import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/global.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

import StoreProvider from '@/app/StoreProvider';
import { AppConfig } from '@/utils/AppConfig';

import Loading from './loading';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!AppConfig.locales.includes(locale)) notFound();

  // Using internationalization in Client Components
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <Suspense key={Date.now()} fallback={<Loading />}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <StoreProvider>{children}</StoreProvider>
            <ToastContainer />
          </NextIntlClientProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}

// Enable edge runtime, but you are required to disable the `migrate` function in `src/libs/DB.ts`
// Unfortunately, this also means it will also disable the automatic migration of the database
// And, you will have to manually migrate it with `drizzle-kit push`
// export const runtime = 'edge';
