import { getTranslations } from 'next-intl/server';

import About from '@/layouts/About';
import FAQs from '@/layouts/FAQs';
import Features from '@/layouts/Features';
import Hero from '@/layouts/hero/index';
import HumanBookBanner from '@/layouts/HumanBookBanner';
import Newsletter from '@/layouts/Newsletter';
import Sponsors from '@/layouts/Sponsors';
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
      <HumanBookBanner />
      <Hero />
      <Features />
      <About />
      <Testimonial />
      <Sponsors />
      <FAQs />
      <Newsletter />
    </>
  );
}
