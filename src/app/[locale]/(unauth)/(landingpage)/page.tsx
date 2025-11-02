import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';

import Hero from '@/layouts/hero';
import HumanBookBanner from '@/layouts/HumanBookBanner';
import OurMascot from '@/layouts/OurMascot';
import { authOptions } from '@/libs/NextAuthOption';

const Features = dynamic(() => import('@/layouts/Features'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const About = dynamic(() => import('@/layouts/About'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const OutstandingFeatures = dynamic(() => import('@/layouts/OutstandingFeatures'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

// const TestAnimation = dynamic(() => import('@/layouts/TestAnimation'), {
//   loading: () => <div>Loading...</div>,
//   ssr: false,
// });

const Testimonial = dynamic(() => import('@/layouts/Testimonial'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Sponsors = dynamic(() => import('@/layouts/Sponsors'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const FAQs = dynamic(() => import('@/layouts/FAQs'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const News = dynamic(() => import('@/layouts/News'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Newsletter = dynamic(() => import('@/layouts/Newsletter'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

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

export default async function Index() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {!session && <HumanBookBanner />}
      <Hero />
      <Features />
      <About />
      <OutstandingFeatures />
      <OurMascot />
      {/* <TestAnimation /> */}
      <Testimonial />
      <Sponsors />
      <FAQs />
      <News />
      <Newsletter />
    </>
  );
}
