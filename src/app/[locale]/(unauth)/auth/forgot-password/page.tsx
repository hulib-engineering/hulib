import { getTranslations } from 'next-intl/server';
import React from 'react';

import { AuthLayout } from '../_components/AuthLayout';

import { ForgotPasswordForm } from './_components/ForgotPasswordForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'ForgotPassword' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Index() {
  return (
    <AuthLayout
      illustrationImage="/assets/images/illustrations/auth/forgot-password-illustration.svg"
      pathName="fotgot-password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
