import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

const DRAFT_PREFIX = 'draft-';

export function useDraftId() {
  const pathname = usePathname();
  const newId = useMemo(() => crypto.randomUUID(), []);

  const segments = pathname.split('/').filter(Boolean);
  if (segments[segments.length - 1] !== 'preview') {
    return newId;
  }

  const rawId = segments[segments.length - 2];
  if (!rawId?.startsWith(DRAFT_PREFIX)) {
    return newId;
  }

  return rawId.slice(DRAFT_PREFIX.length); // "09152fcc-0beb-4144-b3b9-0da9466cc58a"
}
