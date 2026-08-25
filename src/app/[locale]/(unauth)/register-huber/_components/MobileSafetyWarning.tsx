'use client';
import { ShieldCheckIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

export default function MobileSafetyWarning() {
  const t = useTranslations('Huber');

  return (
    <div
      className="mx-4 flex flex-row
      items-center gap-2 rounded-lg border
      border-[#FFAB67] bg-[#FFF9F5] p-2 sm:hidden"
    >
      <ShieldCheckIcon className="shrink-0" color="#FF7301" />
      <div className="text-[14px] font-medium text-[#45484A]">
        {t('safety_warning')}
      </div>
    </div>
  );
}
