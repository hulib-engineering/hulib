'use client';

import { useEffect, useState } from 'react';

/** Matches Tailwind `md` (below 768px = mobile). Same breakpoint as shadcn/ui `useIsMobile`. */
const MOBILE_BREAKPOINT = 768;

/**
 * Returns `true` when viewport width is below {@link MOBILE_BREAKPOINT}.
 * Initial render is `false` to avoid SSR/client hydration mismatches; updates after mount.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const apply = () => {
      setIsMobile(mql.matches);
    };
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  return isMobile;
}
