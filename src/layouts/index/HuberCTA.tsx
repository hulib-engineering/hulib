'use client';

import { Book } from '@phosphor-icons/react/dist/ssr';
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
    <div className="relative h-60 w-full overflow-hidden rounded-2xl lg:rounded-[20px]">
      <Image
        src="/assets/images/pc-home-cta.jpg"
        alt="Short Description Banner"
        width={1216}
        height={480}
        sizes="100vw"
        className="hidden size-full object-cover object-center lg:block"
      />

      <Image
        src="/assets/images/bottom-banner.svg"
        alt="Short Description Banner"
        width={1022}
        height={1024}
        sizes="100vw"
        className="h-[320px] w-full object-cover object-center lg:hidden"
      />

      <div className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-b from-transparent to-white" />

      <div className="absolute bottom-0 left-0 z-10 w-full p-4 lg:bottom-4 lg:left-8 lg:w-fit lg:p-0">
        <div className="flex flex-col gap-2">
          <h6 className="text-sm leading-5 text-primary-10 lg:text-xl lg:font-medium lg:leading-7">
            Short description
          </h6>
          <h3 className="text-[28px] font-medium leading-9 text-primary-10 lg:text-4xl lg:leading-[2.75rem]">
            {t('short_descriptions.title')}
          </h3>
          <Button
            size="lg"
            iconLeft={<Book />}
            onClick={() => router.push(userInfo.role.id === Role.LIBER ? '/me/account-upgrade' : `users/${userInfo.id}`)}
          >
            {t('short_descriptions.btn')}
          </Button>
        </div>
      </div>
    </div>
  );
};
