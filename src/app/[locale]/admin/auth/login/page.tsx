import { getTranslations } from 'next-intl/server';
import React from 'react';

import AdminLoginForm from '@/layouts/admin/AdminLoginForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index() {
  return <AdminLoginForm />;
}
