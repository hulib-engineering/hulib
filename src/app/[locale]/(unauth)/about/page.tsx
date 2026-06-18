import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';

import Hero from '@/app/[locale]/(unauth)/(landingpage)/_components/hero';
import OurMascot from '@/app/[locale]/(unauth)/(landingpage)/_components/OurMascot';
import HumanBookBanner from '@/app/[locale]/(unauth)/(landingpage)/_components/HumanBookBanner';

import { authOptions } from '@/libs/NextAuthOption';

const Features = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Features'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const About = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/About'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const OutstandingFeatures = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/OutstandingFeatures'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Testimonial = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Testimonial'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Sponsors = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Sponsors'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const FAQs = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/FAQs'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const News = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/News'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Newsletter = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Newsletter'), {
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

export default async function AboutPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {!session && <HumanBookBanner />}
      <Hero />
      <Features />
      <About />
      <OutstandingFeatures />
      <OurMascot />
      <Testimonial />
      <Sponsors />
      <FAQs />
      <News />
      <Newsletter />
    </>
  );
}
