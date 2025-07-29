'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    gtag: (command: string, id: string, config: object) => void;
  }
}

type Props = {
  measurementId: string;
};

export default function GoogleAnalytics({ measurementId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    const url = pathname + (searchParams ? `?${searchParams}` : '');
    window.gtag('config', measurementId, {
      page_path: url,
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}
