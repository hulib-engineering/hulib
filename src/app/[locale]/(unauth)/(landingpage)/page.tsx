import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';

import Hero from './_components/hero';
import OurMascot from './_components/OurMascot';
import HumanBookBanner from './_components/HumanBookBanner';

import { authOptions } from '@/libs/NextAuthOption';

const Features = dynamic(() => import('./_components/Features'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const About = dynamic(() => import('./_components/About'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const OutstandingFeatures = dynamic(() => import('./_components/OutstandingFeatures'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

// const TestAnimation = dynamic(() => import('@/layouts/TestAnimation'), {
//   loading: () => <div>Loading...</div>,
//   ssr: false,
// });

const Testimonial = dynamic(() => import('./_components/Testimonial'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Sponsors = dynamic(() => import('./_components/Sponsors'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const FAQs = dynamic(() => import('./_components/FAQs'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const News = dynamic(() => import('./_components/News'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Newsletter = dynamic(() => import('./_components/Newsletter'), {
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
