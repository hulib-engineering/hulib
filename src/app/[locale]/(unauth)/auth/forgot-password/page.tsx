import { getTranslations } from 'next-intl/server';
import React from 'react';

import { AuthLayout } from '@/layouts/AuthLayout';
import { ForgotPasswordForm } from '@/layouts/ForgotPasswordForm';

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

export default function Index() {
  return (
    <AuthLayout
      illustrationImage="/assets/images/forgot-password-illustration.svg"
      pathName="fotgot-password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
