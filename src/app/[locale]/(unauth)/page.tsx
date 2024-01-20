import { getTranslations } from 'next-intl/server';

import CTA from '@/components/CTA';
import FAQs from '@/components/FAQs';
import Feature from '@/components/Feature';
import Hero from '@/components/Hero';

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
    <div className="mt-24 flex flex-col items-center justify-center">
      <Hero />
      <Feature />
      <FAQs />
      <CTA />
    </div>
  );
}
