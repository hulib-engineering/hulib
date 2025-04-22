import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import * as React from 'react';

import LiberProfile from '@/components/liber/LiberProfile';
import { authOptions } from '@/libs/NextAuthOption';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'MyProfile' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index() {
  const session = await getServerSession(authOptions);

  if (!session) return notFound();

  return (
    <div className="mx-auto flex w-5/6 flex-1 flex-col gap-12 lg:gap-20">
      <LiberProfile />
    </div>
  );
}
