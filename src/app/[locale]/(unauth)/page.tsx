import { getTranslations } from 'next-intl/server';

import CTA from '@/components/CTA';
import FAQs from '@/components/FAQs';

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
    <div>
      <FAQs />
      <CTA />
    </div>
  );
}
