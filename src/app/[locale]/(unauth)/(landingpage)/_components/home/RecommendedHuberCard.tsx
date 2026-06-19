'use client';

import { BookOpenText, User, UserMinus, UserPlus } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import React from 'react';

import type { Huber as THuber } from '@/libs/services/modules/huber/huberType';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';

const RecommendedHuberCard = (props: Partial<THuber>) => {
  const router = useRouter();
  const avatarConfig = genConfig(props.fullName ?? String(props.id ?? 'huber'));
  // will remove when integrate API
  const mockTopicHuber = ['Overthinking', 'Gia đình', 'Công việc'];
  const visibleTopics = mockTopicHuber.slice(0, 2) ?? [];
  const remainingTopicsCount = Math.max(mockTopicHuber.length - visibleTopics.length, 0);

  // will remove when integrate API
  const getClassTopic = (topic: string) => {
    switch (topic) {
      case 'Overthinking':
        return 'text-primary-50 bg-blue-90';
      case 'Gia đình':
        return 'text-red-50 bg-red-90';
      default:
        return 'text-neutral-50 bg-neutral-90';
    }
  };

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

      <div className="flex w-full flex-col gap-y-2.5">
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
        {visibleTopics.length > 0 && (
          <div className="flex max-h-[56px] w-full flex-wrap items-start gap-1 overflow-hidden lg:max-h-none lg:flex-nowrap lg:items-center lg:gap-2 lg:overflow-visible">
            {visibleTopics.map(topic => (
              <Chip
                key={topic}
                as="span"
                className={mergeClassnames(
                  'h-auto max-w-full rounded-2xl border px-2 py-1 text-left text-xs font-medium leading-[14px]',
                  getClassTopic(topic),
                )}
              >
                <span className="line-clamp-2 block overflow-hidden break-words">
                  {topic}
                </span>
              </Chip>
            ))}
            {remainingTopicsCount > 0 && (
              <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded border border-primary-80 bg-primary-90 px-2 py-1 text-xs font-medium leading-[14px] text-primary-60">
                +
                {remainingTopicsCount}
              </span>
            )}
          </div>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 xxl:gap-x-4">
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
