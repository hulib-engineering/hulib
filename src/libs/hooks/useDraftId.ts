import { useParams, usePathname } from 'next/navigation';

export function useDraftId() {
  const pathname = usePathname();
  const { id } = useParams<{ id?: string }>();

  const isDraft = pathname.split('/').includes('draft');
  return isDraft ? id : undefined;
}
