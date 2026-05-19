'use client';

import { BookOpen } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/core/button/Button';
import { useAppSelector } from '@/libs/hooks';
import { Role } from '@/types/common';

export default function HuberCTA() {
  const router = useRouter();
  const t = useTranslations('Home');
  const userInfo = useAppSelector(state => state.auth.userInfo);

  return (
    <div className="relative inset-x-1/2 -mb-8 h-[430px] w-screen overflow-hidden -translate-x-1/2 sm:h-[360px] lg:h-[532px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-white/80 to-transparent lg:h-24" />

      {/* Mobile Background */}
      <div className="absolute inset-0 sm:hidden">
        <Image
          src="/assets/images/bottom-banner.svg"
          alt="Short Description Banner Mobile"
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>

      {/* Tablet/Desktop Background */}
      <Image
        src="/assets/images/pc-home-cta.jpg"
        alt="Short Description Banner"
        fill
        sizes="100vw"
        className="hidden object-cover object-center sm:block lg:block"
      />

      <div className="absolute inset-x-0 top-8 z-20 flex justify-center px-4 sm:top-10 lg:top-12">
        <div className="w-full max-w-[340px] rounded-2xl border border-gray-100 bg-white px-6 py-5 text-center shadow-[0_8px_32px_rgba(16,24,40,0.10)] sm:max-w-[400px] sm:px-8 sm:py-6 lg:max-w-[480px] lg:px-10 lg:py-8">
          <h3 className="text-lg font-bold leading-7 text-gray-900 sm:text-xl lg:text-2xl">
            {t('short_descriptions.title')}
          </h3>

          <p className="mt-1.5 text-sm font-medium leading-5 text-gray-500 sm:mt-2">
            {t('short_descriptions.subtitle')}
          </p>

          <Button
            size="lg"
            iconLeft={<BookOpen size={16} />}
            className="mt-4 w-full rounded-full sm:mt-5"
            onClick={() =>
              router.push(
                userInfo.role.id === Role.LIBER
                  ? '/me/account-upgrade'
                  : `users/${userInfo.id}`,
              )}
          >
            {t('short_descriptions.btn')}
          </Button>
        </div>
      </div>
    </div>
  );
}
