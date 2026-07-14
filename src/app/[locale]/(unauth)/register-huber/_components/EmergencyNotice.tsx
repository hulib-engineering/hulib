'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function EmergencyNotice() {
  const t = useTranslations('Huber');

  return (
    <div className="flex items-center gap-2
      rounded-lg border border-[#FFAB67] bg-[#FFF9F5]
      p-2"
    >
      <Image
        src="/assets/images/register-huber/shield_check.png"
        alt="Emergency"
        width={20}
        height={20}
      />
      <p className="text-[14px] font-[500] leading-5 text-[#45484A]">
        {t('emergency_notice')}
      </p>
    </div>
  );
}
