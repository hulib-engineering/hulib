import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

export default function BackButtonHeader({ text }: { text?: string }) {
  const t = useTranslations('Huber');
  const buttonText = text ?? t('create_book_title');

  return (
    <>
      <header className="fixed top-0 z-40
        flex w-full items-center gap-4 bg-white px-24
        py-[18px]
        shadow-[0_0_6px_0_rgba(0,0,0,0.12)]
        max-md:gap-3 max-md:px-4 max-md:pb-2"
      >
        <button
          onClick={() => history.back()}
          className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
          aria-label={t('back')}
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-[32px] font-medium leading-[40px] text-gray-900 max-md:text-[20px]">
          {buttonText}
        </h1>
      </header>
      <div className="pb-16 sm:pb-20" aria-hidden="true" />
    </>
  );
}
