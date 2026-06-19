'use client';

import { BookOpenText, User, UserMinus, UserPlus } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import React from 'react';

import type { Huber as THuber } from '@/libs/services/modules/huber/huberType';
import Button from '@/components/core/button/Button';

const RecommendedHuberCard = (props: Partial<THuber>) => {
  const router = useRouter();
  const avatarConfig = genConfig(props.fullName ?? String(props.id ?? 'huber'));

  return (
    <div
      className="flex w-full cursor-pointer flex-col gap-1.5 pb-2 text-left lg:max-w-40 xxl:max-w-[263px]"
    >
      <button
        type="button"
        onClick={() => router.push(`/users/${props.id}`)}
      >
        {props.photo?.path ? (
          <Image
            src={props.photo.path}
            alt={props.fullName ?? 'Huber Avatar'}
            width={140}
            height={140}
            className="aspect-square w-full rounded-[28px] object-cover"
            unoptimized
            onClick={() => router.push(`/users/${props.id}`)}
          />
        ) : (
          <NiceAvatar
            className="aspect-square w-full rounded-[28px]"
            {...avatarConfig}
          />
        )}
      </button>

      <div className="flex w-full flex-col gap-1">
        <button
          type="button"
          onClick={() => router.push(`/users/${props.id}`)}
        >
          <h5
            className="line-clamp-1 w-full text-xl font-medium leading-7 text-primary-10"
          >
            {props.fullName}
          </h5>
        </button>
        <div className="flex flex-wrap items-center gap-2 xxl:gap-x-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <BookOpenText className="text-neutral-50" size={16} weight="bold" />
              <span className="text-xs leading-4 text-neutral-20">
                {props.humanBookTopic?.length ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="text-neutral-50" size={16} weight="bold" />
              <span className="text-xs leading-4 text-neutral-20">
                {props.rating ?? 0}
              </span>
            </div>
          </div>
          <Button
            variant={(props?.humanBookTopic?.length ?? 0) >= 5 ? 'fill' : 'outline'}
            iconLeft={(props?.humanBookTopic?.length ?? 0) >= 5 ? <UserMinus size={20} weight="bold" /> : <UserPlus size={20} weight="bold" />}
            className="flex-1 basis-full rounded-full py-3 text-base font-medium leading-5 xxl:basis-auto xxl:whitespace-nowrap"
          >
            {(props?.humanBookTopic?.length ?? 0) >= 5 ? 'Hủy theo dõi' : 'Theo dõi'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { RecommendedHuberCard };
