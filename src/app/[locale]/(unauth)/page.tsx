import { getTranslations } from 'next-intl/server';

import About from '@/layouts/About';
import FAQs from '@/layouts/FAQs';
import Features from '@/layouts/Features';
import Hero from '@/layouts/Hero';
import Newsletter from '@/layouts/Newsletter';
import Testimonial from '@/layouts/Testimonial';

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
      <Testimonial />
      <FAQs />
      <Newsletter />
    </>
  );
}
