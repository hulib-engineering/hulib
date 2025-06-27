import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { AuthLayout } from '@/layouts/AuthLayout';
import { LoginWithSession } from '@/layouts/LoginForm';
import { authOptions } from '@/libs/NextAuthOption';

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
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/home');
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
