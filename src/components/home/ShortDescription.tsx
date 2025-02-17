'use client';

import { Book } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '../button/Button';
import { useRouter } from 'next/navigation';

const ShortDescription = () => {
  const t = useTranslations('Home');
  const router = useRouter();
  return (
    <div className="relative mt-8 h-full w-full">
      <Image
        src="/assets/images/short-description.png"
        alt="Short Description Banner"
        width={0}
        height={0}
        sizes="100vw"
        className="h-[12rem] md:h-full w-full"
      />
      <div className="absolute bottom-8 left-8">
        <div className="flex flex-col items-start justify-center gap-2">
          <p className="text-xs md:text-xl font-medium leading-[1.125rem] md:leading-7 text-primary-10">
            {t('short_descriptions.description')}
          </p>
          <h3 className="text-base md:text-[2.25rem] font-medium leading-[2.9375rem] md:leading-[2.75rem] text-primary-10">
            {t('short_descriptions.title')}
          </h3>
          <Button
            className="h-11 w-[20.4375rem] text-base font-medium"
            iconLeft={<Book />}
            onClick={() => router.push('human-book-register')}
          >
            {t('short_descriptions.btn')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShortDescription;
