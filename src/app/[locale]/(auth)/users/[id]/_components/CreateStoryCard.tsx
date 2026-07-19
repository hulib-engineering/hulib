'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { mergeClassnames } from '@/components/core/private/utils';

type CreateStoryCardProps = {
  className?: string;
  onClick: () => void;
};

export default function CreateStoryCard({ className, onClick }: CreateStoryCardProps) {
  const t = useTranslations('MyProfile');

  return (
    <div className={mergeClassnames('flex size-full min-h-[220px] w-full items-center justify-center rounded-[20px] border border-lavender-80 bg-white md:min-h-[287px]', className)}>
      <div className="flex flex-col items-center gap-6">
        <Image
          className="cursor-pointer"
          src="/assets/images/register-huber/add_book.png"
          alt="add new book"
          width={120}
          height={116}
          onClick={onClick}
        />
        <button
          type="button"
          onClick={onClick}
          className="flex h-11 w-[232px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
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
    </div>
  );
}
