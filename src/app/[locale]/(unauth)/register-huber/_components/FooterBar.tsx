'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type FooterBarProps = {
  canContinue: boolean;
  onContinue: () => void;
};

export default function FooterBar({ canContinue, onContinue }: FooterBarProps) {
  const t = useTranslations('Huber');

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Emergency notice */}
      <div className="flex items-start gap-2 rounded-xl border border-[#FFAB67] bg-[#FFF9F5] px-[20px] py-[12px]">
        <Image src="/assets/images/register-huber/shield_check.png" alt="Emergency" width={20} height={20} />
        <p className="text-[14px] font-[500] leading-[20px] text-[#45484A]">
          {t('emergency_notice')}
        </p>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        disabled={!canContinue}
        className={`shrink-0 rounded-full px-8 py-3 text-sm font-semibold transition-colors
          ${canContinue
      ? 'cursor-pointer bg-primary-50 text-white hover:bg-indigo-600'
      : 'bg-[#E3E4E5] text-[#ABAEB1]'
    } h-[44px] w-[250px]`}
      >
        {t('continue')}
      </button>
    </div>
  );
}
