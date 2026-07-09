'use client';

import { useTranslations } from 'next-intl';

export default function MyBook() {
  const t = useTranslations('MyProfile');

  return (
    <div>{t('about_panel.my_book')}</div>
  );
}
