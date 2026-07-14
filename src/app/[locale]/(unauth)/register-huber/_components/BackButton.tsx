import { useTranslations } from 'next-intl';

type BackButtonProps = {
  text?: string;
};

export default function BackButton({ text }: BackButtonProps) {
  const t = useTranslations('Huber');
  const buttonText = text ?? t('create_book_title');

  return (
    <div className="pb-16 sm:pb-20">
      <div className="fixed top-0 z-40
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
          <svg className="size-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1
          className="text-[32px] font-medium leading-[40px] text-gray-900
          max-md:text-[20px]"
        >
          {buttonText}
        </h1>
      </div>
    </div>
  );
}
