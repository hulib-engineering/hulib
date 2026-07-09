import Link from 'next/link';
import { useTranslations } from 'node_modules/next-intl/dist/types/src/react-client';

export default function NotFound() {
  const t = useTranslations('Common');
  return (
    <div>
      <h2>{t('not_found')}</h2>
      <p>{t('could_not_find_resource')}</p>
      <Link href="/">{t('return_home')}</Link>
    </div>
  );
}
