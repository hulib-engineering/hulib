'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import FeatureCard from '@/components/FeatureCard';
import { mergeClassnames } from '@/components/core/private/utils';
import EventFormModal from '@/layouts/event/EventFormModal';
import SuccessModal from '@/layouts/event/SuccessModal';

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

  const [isRegisteringEventFormModalOpen, setIsRegisteringEventFormModalOpen]
    = useState(false);
  const [isSuccessfulModalOpen, setIsSuccessfulModalOpen] = useState(false);
  const [registerName, setRegisterName] = useState('');

  const handleSuccess = (name: string) => {
    setIsSuccessfulModalOpen(true);
    setRegisterName(name);
  };

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
        <div className="pb-1 lg:w-full lg:max-w-screen-lg">
          <div className="flex w-full flex-col items-center justify-start px-4 text-center sm:px-0">
            <p className="mb-4 text-xs font-medium uppercase text-lp-primary-blue lg:text-lg">
              {t('event_title')}
            </p>
          </div>
        </div>
      </section>

      <div className="flex w-full items-center justify-center px-4 sm:px-0">
        <div className="w-full md:w-5/6">
          <Image
            alt="Event banner"
            src="/assets/images/event-banner.png"
            priority
            width={1920}
            height={960}
            className="mx-auto hidden object-contain md:block"
            onClick={() =>
              setIsRegisteringEventFormModalOpen(
                !isRegisteringEventFormModalOpen,
              )}
          />
          <Image
            alt="Event banner"
            src="/assets/images/event-banner-sp.png"
            priority
            width={375}
            height={375}
            className="mx-auto object-contain md:hidden"
            onClick={() =>
              setIsRegisteringEventFormModalOpen(
                !isRegisteringEventFormModalOpen,
              )}
          />
        </div>
      </div>

      <section className="w-full flex-col items-center justify-center px-8 py-6 sm:mt-0 lg:py-12 xl:px-48 2xl:px-[20.625rem]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-6">
          {EventFeatureList.map(feature => (
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

      <EventFormModal
        open={isRegisteringEventFormModalOpen}
        onClose={() => setIsRegisteringEventFormModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <SuccessModal
        name={registerName}
        open={isSuccessfulModalOpen}
        onClose={() => setIsSuccessfulModalOpen(false)}
      />
    </>
  );
};

export default PromotedEvent;
