'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Book } from '@phosphor-icons/react';

import Button from '@/components/core/button/Button';
import { useMobile } from '@/libs/hooks';

export default function HuberCTA() {
  const t = useTranslations('Home');

  const isMobile = useMobile();

  return (
    <div className="relative inset-x-1/2 -mb-8 h-[403px] w-screen overflow-hidden bg-gradient-to-t from-[#fdf3ce] to-transparent -translate-x-1/2 md:h-[532px]">
      {/* Top fade into page background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-16 bg-gradient-to-b from-white/80 to-transparent md:block lg:h-24" />

      {/* Desktop background image — matches Figma: frame at bottom-[-475px], image overflows */}
      <div className="absolute bottom-[-475px] left-1/2 z-0 hidden h-[983px] w-[1216px] overflow-hidden -translate-x-1/2 md:block">
        <Image
          src="/assets/images/backgrounds/cta-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          sizes="1216px"
          aria-hidden
        />
      </div>

      {/* Mobile background image — Figma: 628×508 frame at top:24px, center-cropped */}
      <div className="absolute left-1/2 top-6 z-0 h-[508px] w-[628px] overflow-hidden -translate-x-1/2 md:hidden">
        <Image
          src="/assets/images/backgrounds/cta-bg.png"
          alt=""
          fill
          className="object-cover object-top"
          sizes="628px"
          aria-hidden
        />
      </div>

      {/* CTA Card */}
      <div className="absolute left-1/2 top-12 z-20 justify-center -translate-x-1/2">
        <div className="flex w-[366px] flex-col gap-5 rounded-[32px] bg-white p-5 ring-8 ring-white/60 backdrop-blur-[50px] md:w-[502px] md:p-8">
          {!isMobile ? (
            <h2 className="text-center text-[36px] font-medium leading-[44px] text-primary-10">
              {t('short_descriptions.title')}
            </h2>
          ) : (
            <h5 className="text-center text-2xl font-medium leading-8 text-primary-10">
              {t('short_descriptions.title')}
            </h5>
          )}

          {!isMobile ? (
            <h6 className="text-center text-xl font-medium leading-[28px] text-primary-10">
              {t('short_descriptions.subtitle')}
            </h6>
          ) : (
            <p className="text-center text-sm text-primary-10">
              {t('short_descriptions.subtitle')}
            </p>
          )}

          <Button
            iconLeft={<Book />}
            className="w-full rounded-full"
          >
            {t('short_descriptions.btn')}
          </Button>
        </div>
      </div>
    </div>
  );
}
