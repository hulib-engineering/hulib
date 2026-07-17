'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function StoriesOthersEmptyState() {
  const t = useTranslations('MyProfile');

  return (
    <div className="flex flex-col items-center gap-6">
      <Image
        src="/assets/images/landing/no-results-found.png"
        className="h-[312px] w-[398px] object-contain lg:h-[378px] lg:w-[482px]"
        width={482}
        height={378}
        quality={100}
        alt="No results found"
      />
      <div className="flex flex-col gap-2 text-center text-primary-10">
        <h5 className="text-2xl font-bold capitalize leading-8">
          {t('no_stories_found')}
        </h5>
        <p>{t('huber_has_not_finished_stories')}</p>
      </div>
    </div>
  );
}
