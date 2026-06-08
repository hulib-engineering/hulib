import { getTranslations } from 'next-intl/server';
import React from 'react';

import { AuthLayout } from '../_components/AuthLayout';

import { RegistrationForm } from './_components/RegistrationForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'SignUp' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Index() {
  return (
    <AuthLayout illustrationImage="/assets/images/illustrations/auth/register-illustration.svg">
      <RegistrationForm />
    </AuthLayout>
  );
}
