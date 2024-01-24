import { getTranslations } from 'next-intl/server';

import About from '@/layouts/About';
import Features from '@/layouts/Features';
import Hero from '@/layouts/Hero';

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
    <>
      <Hero />
      <Features />
      <About />
    </>
  );
}
