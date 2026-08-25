import { useTranslations } from 'next-intl';

import { Link } from '@/libs/i18nNavigation';

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
