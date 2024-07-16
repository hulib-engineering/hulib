import { getTranslations } from 'next-intl/server';
import React from 'react';

import About from '@/layouts/About';
import FAQs from '@/layouts/FAQs';
import Newsletter from '@/layouts/Newsletter';
import PromotedEvent from '@/layouts/PromotedEvent';
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
      {/* <Hero /> */}
      <PromotedEvent />
      {/* <Features /> */}
      <About />
      <Testimonial />
      {/* <Sponsors /> */}
      <FAQs />
      <Newsletter />
    </>
  );
}
