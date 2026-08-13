'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { mergeClassnames } from './core/private/utils';

type CreateNewStoryButtonProps = {
  className?: string;
  onClick?: () => void;
};

export default function CreateNewStoryButton({ onClick, className }: CreateNewStoryButtonProps) {
  const t = useTranslations('MyProfile');

  return (
    <button
      type="button"
      onClick={onClick}
      className={mergeClassnames('flex h-11 w-full max-w-[318px] border shadow-[0px_0px_0px_2px_rgba(132,_172,_252,_1)] border-primary-50 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90', className)}
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
  );
}
