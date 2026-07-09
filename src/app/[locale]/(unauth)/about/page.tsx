import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';

import Hero from '@/app/[locale]/(unauth)/(landingpage)/_components/hero';
import Loading from '@/app/[locale]/(unauth)/(landingpage)/_components/Loading';
import OurMascot from '@/app/[locale]/(unauth)/(landingpage)/_components/OurMascot';
import HumanBookBanner from '@/app/[locale]/(unauth)/(landingpage)/_components/HumanBookBanner';

import { authOptions } from '@/libs/NextAuthOption';

const Features = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Features'), {
  loading: () => <Loading />,
  ssr: false,
});

const About = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/About'), {
  loading: () => <Loading />,
  ssr: false,
});

const OutstandingFeatures = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/OutstandingFeatures'), {
  loading: () => <Loading />,
  ssr: false,
});

const Testimonial = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Testimonial'), {
  loading: () => <Loading />,
  ssr: false,
});

const Sponsors = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Sponsors'), {
  loading: () => <Loading />,
  ssr: false,
});

const FAQs = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/FAQs'), {
  loading: () => <Loading />,
  ssr: false,
});

const News = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/News'), {
  loading: () => <Loading />,
  ssr: false,
});

const Newsletter = dynamic(() => import('@/app/[locale]/(unauth)/(landingpage)/_components/Newsletter'), {
  loading: () => <Loading />,
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
