'use client';

import { Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import type { Huber as THuber } from '@/libs/services/modules/huber/huberType';

const RecommendedHuberCard = (props: Partial<THuber>) => {
  const t = useTranslations('Huber.card');

  return (
    <div className="flex flex-col gap-2">
      <Image
        src={props.photo?.path ?? '/assets/images/ava-placeholder.png'}
        alt={props.fullName ?? 'Huber Avatar'}
        width={140}
        height={140}
        className="size-[140px] rounded-[32px] object-cover lg:size-40"
        unoptimized
      />

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-xs font-medium leading-[14px] text-primary-10 lg:text-base lg:leading-6">
          {props.fullName}
        </p>
        {/* <p className="my-1 text-base font-normal text-neutral-30 md:text-lg"> */}
        {/*  /!* {huber.role} *!/ */}
        {/*  /!* {huber.humanBookTopic.length} *!/ */}
        {/* </p> */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-0.5">
            <span className="text-xs leading-[14px] text-neutral-20">
              {props.humanBookTopic?.length ?? 0}
            </span>
            <span className="text-[0.625rem] leading-3 text-neutral-40">
              {t('topics')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="text-pink-50" weight="fill" />
            <span className="text-xs leading-[0.875rem] text-neutral-20">
              {props.rating ?? 0}
            </span>
            <span className="text-[0.625rem] leading-3 text-neutral-40">
              Hearts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RecommendedHuberCard };
