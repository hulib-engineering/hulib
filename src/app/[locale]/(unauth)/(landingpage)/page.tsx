import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

// Import các component cần thiết ngay lập tức
import Hero from '@/layouts/hero/index';
import HumanBookBanner from '@/layouts/HumanBookBanner';

// Dynamic imports cho các component không cần thiết ngay lập tức
const Features = dynamic(() => import('@/layouts/Features'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const About = dynamic(() => import('@/layouts/About'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

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
