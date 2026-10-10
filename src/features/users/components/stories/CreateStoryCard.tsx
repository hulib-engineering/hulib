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
    <div
      className={mergeClassnames(
        'flex size-full min-h-[260px] w-full items-center justify-center rounded-[20px] border border-lavender-70 bg-gradient-to-br from-white via-[#FBF7FF] to-[#F4FAFF] shadow-[0_8px_24px_rgba(76,62,124,0.08)] md:min-h-[320px]',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={onClick}
          className="rounded-full bg-white/80 p-5 shadow-[0_10px_30px_rgba(8,88,250,0.12)] transition-transform hover:scale-105"
        >
          <Image
            src="/assets/images/register-huber/add_book.png"
            alt="add new book"
            width={126}
            height={122}
          />
        </button>
        <button
          type="button"
          onClick={onClick}
          className="flex h-11 w-[260px] max-w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-50 via-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(8,88,250,0.20)] transition-opacity hover:opacity-90"
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
