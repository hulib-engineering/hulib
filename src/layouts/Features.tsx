import { useTranslations } from 'next-intl';
import React from 'react';

import FeatureCard from '@/components/FeatureCard';

const FeatureList = [
  {
    key: 'feature_peers' as const,
    bgColor: 'bg-lime-350/[.75]',
    shadowColor: 'shadow-[0_12px_24px_0_rgba(187,249,158,0.25)]',
    thumbnailUrl: '/assets/images/feature-0.png',
  },
  {
    key: 'feature_online_meetings' as const,
    bgColor: 'bg-violet-350/[.75]',
    shadowColor: 'shadow-[0_12px_24px_0_rgba(204,186,254,0.25)]',
    thumbnailUrl: '/assets/images/feature-1.png',
  },
  {
    key: 'feature_safely_sharing' as const,
    bgColor: 'bg-amber-75/[.75]',
    shadowColor: 'shadow-[0_12px_24px_0_rgba(255,224,142,0.25)]',
    thumbnailUrl: '/assets/images/feature-2.png',
  },
];

const Features = () => {
  const t = useTranslations('Index');

  return (
    <section className="mx-auto mt-8 w-full max-w-container-sm flex-col items-center justify-center p-spacing-md py-6 sm:mt-0 lg:py-12 xl:max-w-container-xl xl:px-[90px]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-6">
        {FeatureList.map((feature) => (
          <FeatureCard
            key={feature.key}
            title={t(`${feature.key}.title`)}
            description={t(`${feature.key}.description`)}
            bgColor={feature.bgColor}
            shadowColor={feature.shadowColor}
            thumbnailUrl={feature.thumbnailUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
