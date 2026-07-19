'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

type MyStoriesEmptyStateProps = {
  onCreateClick: () => void;
};

export default function MyStoriesEmptyState({ onCreateClick }: MyStoriesEmptyStateProps) {
  const t = useTranslations('MyProfile');

  return (
    <div className="flex w-full flex-col items-center gap-4 py-10">
      <div className="relative size-[120px] overflow-hidden rounded-full">
        <Image
          src="/assets/images/register-huber/empty_book.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <p className="text-lg font-medium text-primary-50 md:text-xl">
        {t('no_own_stories_title')}
      </p>
      <p className="max-w-[398px] px-2 text-center text-sm text-neutral-10 md:text-base">
        {t('no_own_stories_body')}
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="flex h-11 w-full max-w-[318px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <Image
          src="/assets/images/register-huber/white_book.png"
          alt=""
          width={18}
          height={18}
          className="object-contain"
        />
        {t('create_new_story')}
      </button>
    </div>
  );
}
