'use client';
import { CalendarDot, X } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Button from '@/components/core/button/Button';

type FBModal = | {
  onClose: () => void;
};

export default function FirstBookCreatedModal({ onClose }: FBModal) {
  const t = useTranslations('FirstBookCreated');

  return (
    <div className="flex size-full max-h-[900px]
            max-w-[400px] flex-col items-center gap-20 rounded-2xl
            sm:max-w-[1244px]"
    >
      {/* Close button 'x' */}
      <button
        type="button"
        className="absolute right-5 top-5 p-3"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>
      {/* Content */}
      <div className="flex h-full max-h-[800px]
                flex-col items-center
                gap-8 pb-[230px] pt-[76px]"
      >
        {/* Top section */}
        <div className="flex max-h-[348.67px] w-full flex-col items-center justify-center rounded-xl px-[54px]">
          {/* 1. Icon */}
          <Image src="/assets/images/register-huber/huber.png" alt="huber" width={331} height={221} />
          {/* 2. Texts */}
          <div className="flex max-w-[480px] flex-col items-center gap-2 sm:max-w-[480px]">
            <div className="size-full max-h-[72px] max-w-[241px] text-center text-[20px]
                            font-medium tracking-[-0.02em] text-[#0442BF] sm:max-w-[331px] sm:text-[28px] sm:leading-9"
            >
              <span className="max-sm:text-black">{t('welcome_title')}</span>
              {' '}
              <b>Huber</b>
              {' '}
              🎉
            </div>
            <div className="w-full max-w-[335px] text-center
                            text-[14px] font-[375] sm:max-w-[480px] sm:text-[16px]"
            >
              {t('welcome_description')}
            </div>
          </div>
        </div>
        {/* Bottom section */}
        <div className="flex size-full max-h-[227px] max-w-[354px] flex-col gap-6
                    rounded-xl bg-[#FFF9F5] p-4 sm:max-w-[480px] "
        >
          {/* 1. Icon and texts */}
          <div className="flex size-full max-w-[342px]
                        items-center gap-4 sm:max-h-[107px] sm:max-w-[448px]"
          >
            {/* 1.1 Icon */}
            <Image src="/assets/images/register-huber/calendar.png" alt="calendar" width={101} height={107} />
            {/* 1.2 Texts */}
            <div className="flex size-full max-w-[225px] flex-col
                            items-start gap-1 sm:max-h-[76px] sm:max-w-[336px]"
            >
              <div className="size-full max-w-[225px] text-[16px] font-medium leading-7 tracking-[-0.01em]
                                text-black sm:max-h-[38px] sm:text-[20px]"
              >
                {t('update_schedule_title')}
              </div>
              <div className="h-full text-sm font-[375] not-italic leading-[22px]
                                tracking-[0.015em] text-black sm:max-h-[44px]"
              >
                {t('update_schedule_description')}
              </div>
            </div>
          </div>
          {/* 2. Button */}
          {/* TODO: need add action */}
          <Button
            onClick={onClose}
            className="flex size-full max-w-[342px] items-center justify-center gap-2 rounded-full border border-solid border-[#0442BF]
                      px-4 font-[375] sm:max-w-[448px]"
            iconLeft={<CalendarDot size={20} />}
          >
            {t('update_schedule_button')}
          </Button>
        </div>
      </div>
    </div>
  );
}
