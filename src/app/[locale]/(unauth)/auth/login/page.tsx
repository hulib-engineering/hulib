import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import AdminLoginForm from '@/layouts/admin/AdminLoginForm';
import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginWithSession } from '@/layouts/LoginForm';

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
  const headersList = headers();
  const host = headersList.get('host') ?? '';
  // Normalize to handle ports in dev, e.g. admin.localhost:3000
  const hostname = host.split(':')[0] ?? '';

  const isAdmin = hostname.startsWith('admin.');

  if (isAdmin) {
    return <AdminLoginForm />;
  }

  return (
    <AuthLayout
      illustrationImage="/assets/images/login-illustration.svg"
      pathName="login"
    >
      <LoginWithSession />
    </AuthLayout>
  );
}
