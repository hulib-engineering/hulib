'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';
import FeatureCard from '@/components/FeatureCard';
import { mergeClassnames } from '@/components/private/utils';

const EventFeatureList = [
  {
    key: 'event_feature_peers' as const,
    bgColor: 'bg-lime-350/[.75]',
    shadowColor: 'shadow-[0_12px_24px_0_rgba(187,249,158,0.25)]',
    thumbnailUrl: '/assets/images/feature-0.png',
  },
  {
    key: 'event_feature_online_meetings' as const,
    bgColor: 'bg-violet-350/[.75]',
    shadowColor: 'shadow-[0_12px_24px_0_rgba(204,186,254,0.25)]',
    thumbnailUrl: '/assets/images/feature-1.png',
  },
  {
    key: 'event_feature_safely_sharing' as const,
    bgColor: 'bg-amber-75/[.75]',
    shadowColor: 'shadow-[0_12px_24px_0_rgba(255,224,142,0.25)]',
    thumbnailUrl: '/assets/images/feature-2.png',
  },
];

const PromotedEvent = () => {
  const t = useTranslations('Index');

  return (
    <>
      <section
        className={mergeClassnames(
          'mx-auto flex w-full flex-col items-center justify-center py-8',
          'sm:w-3/4 sm:px-8 gap-4 lg:max-w-7xl lg:px-10 lg:gap-16 2xl:px-[5.625rem]',
        )}
        data-testid="event-section"
        id="event"
      >
        <div className="pb-3 lg:w-full lg:max-w-screen-lg">
          <div className="mb-6 flex w-full flex-col items-center justify-start px-4 text-center sm:px-0 lg:mb-12">
            <p className="mb-4 text-xs font-medium uppercase text-primary lg:mb-8 lg:text-lg">
              {t('event_title')}
            </p>
            <h1 className="px-4 text-[1.75rem] font-semibold capitalize text-slate-1000 sm:text-[5rem]">
              emotional bank!
            </h1>
            <h1 className="mb-6 px-4 text-[1.75rem] font-semibold capitalize text-slate-1000/30 sm:text-[5rem] lg:mb-12">
              ngân hàng cảm xúc!
            </h1>
            <p className="text-sm font-normal text-black sm:text-2xl">
              {t('event_description')}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <Button
              as="a"
              rel="noopener noreferrer"
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSemPvwCrQ1YSFs7Yv9a4FXpuzDF0sK7EKb9BFcwL5LlFh6bAw/viewform"
              className="rounded-full uppercase"
              iconRight={
                <Image
                  width={24}
                  height={24}
                  src="/assets/images/icons/arow-drop-right.svg"
                  alt="Routing icon"
                  loading="lazy"
                />
              }
            >
              {t('event_call_to_action')}
            </Button>
          </div>
        </div>
        <div className="w-full px-4 sm:px-0">
          <Image
            alt="Event banner"
            src="/assets/images/event-banner.png"
            priority
            width={1196}
            height={480}
            className="object-cover object-center"
          />
        </div>
      </section>
      <section className="w-full flex-col items-center justify-center px-8 py-6 sm:mt-0 lg:py-12 xl:px-48 2xl:px-[20.625rem]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-6">
          {EventFeatureList.map((feature) => (
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
    </>
  );
};

export default PromotedEvent;
