'use client';
import { CalendarDot, X } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';

type FBModal = | {
  onClose: () => void;
};

export default function FirstBookCreatedModal(props: FBModal) {
  const tCommon = useTranslations('Common');
  return (
    <div className="flex size-full max-h-[900px]
            flex-col items-center gap-20 rounded-2xl"
    >
      {/* Close button 'x' */}
      <IconButton
        type="button"
        variant="ghost"
        className="absolute right-5 top-5 p-3"
        onClick={props.onClose}
        aria-label="Close"
      >
        <X size={20} />
      </IconButton>
      {/* Content */}
      <div className="flex h-full max-h-[800px]
                flex-col items-center
                gap-8 pb-[200px] pt-20"
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
              <span className="max-sm:text-black">
                {tCommon('welcome_to_community')}
              </span>
              {' '}
              <b>Huber</b>
              {' '}
              🎉
            </div>
            <div className="w-full max-w-[335px] text-center
                            text-[14px] font-[375] sm:max-w-[480px] sm:text-[16px]"
            >
              {tCommon('first_book_approved')}
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
                {tCommon('update_your_schedule')}
              </div>
              <div className="h-full text-sm font-[375] not-italic leading-[22px]
                                tracking-[0.015em] text-black sm:max-h-[44px]"
              >
                {tCommon('update_schedule_description')}
              </div>
            </div>
          </div>
          {/* 2. Button */}
          <Button
            onClick={() => { }}
            className="flex size-full max-w-[342px] items-center justify-center gap-2 rounded-full border border-solid border-[#0442BF]
                      px-4 font-[375] sm:max-w-[448px]"
            iconLeft={<CalendarDot size={20} />}
          >
            {tCommon('update_personal_schedule')}
          </Button>
        </div>
      </div>
    </div>
  );
}
