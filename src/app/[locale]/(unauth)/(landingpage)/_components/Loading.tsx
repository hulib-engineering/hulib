'use client';

import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('Common');
  return <div>{t('loading')}</div>;
}
