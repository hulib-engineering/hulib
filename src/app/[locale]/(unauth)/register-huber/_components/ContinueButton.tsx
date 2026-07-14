'use client';
import { useTranslations } from 'next-intl';

type ContinueButtonProps = {
  canContinue: boolean;
  onContinue: () => void;
};

export default function ContinueButton({ canContinue, onContinue }: ContinueButtonProps) {
  const t = useTranslations('Huber');

  return (
    <button
      onClick={onContinue}
      disabled={!canContinue}
      className={`shrink-0 rounded-full px-8 py-3 text-sm font-semibold transition-colors
        ${canContinue
      ? 'cursor-pointer bg-primary-50 text-white hover:bg-indigo-600'
      : 'bg-[#E3E4E5] text-[#ABAEB1]'
    } h-[44px] max-sm:w-full sm:w-[250px]`}
    >
      {t('continue')}
    </button>
  );
}
