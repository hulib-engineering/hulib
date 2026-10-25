'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function StoriesOthersEmptyState() {
  const t = useTranslations('MyProfile');

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <Image
        src="/assets/images/landing/no-results-found.png"
        className="h-auto w-full max-w-[312px] object-contain md:max-w-[398px] lg:max-w-[482px]"
        width={482}
        height={378}
        quality={100}
        alt="No results found"
      />
      <div className="flex flex-col gap-2 px-2 text-center text-primary-10">
        <h5 className="text-xl font-bold capitalize leading-8 md:text-2xl">
          {t('no_stories_found')}
        </h5>
        <p className="text-sm md:text-base">{t('huber_has_not_finished_stories')}</p>
      </div>
    </div>
  );
}
