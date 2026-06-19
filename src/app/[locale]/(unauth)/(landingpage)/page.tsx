import { getTranslations } from 'next-intl/server';

import HomePageContent from './_components/home/HomePageContent';

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
  return <HomePageContent />;
}
