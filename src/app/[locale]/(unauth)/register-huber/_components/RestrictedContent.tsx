'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const contentKeys = [
  'restricted_content.items.item_1',
  'restricted_content.items.item_2',
  'restricted_content.items.item_3',
  'restricted_content.items.item_4',
  'restricted_content.items.item_5',
  'restricted_content.items.item_6',
] as const;

export default function RestrictedContent() {
  const t = useTranslations('Huber');

  return (
    <div className="max-sm:px-4">
      <div className="w-full rounded-2xl border border-[#FFE3CC] bg-[#FFF9F5] px-3 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full bg-[#FFE3CC] p-2">
            <Image
              src="/assets/images/register-huber/warning.png"
              alt="warning"
              width={30}
              height={30}
            />
          </div>
          <h3 className="text-[16px] font-[500] leading-6 tracking-[0.5%] text-black">{t('content_to_avoid')}</h3>
        </div>

        {/* Grid 2 columns */}
        <div className="grid grid-cols-2 gap-2">
          {contentKeys.map((key, idx) => (
            <div key={idx} className="flex items-start gap-2.5 sm:items-center">
              <Image
                src="/assets/images/register-huber/x_circle.png"
                alt="x-circle"
                width={20}
                height={20}
                className="mt-0.5"
              />
              <span className="text-[14px] leading-[18px] text-[#171819]">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
