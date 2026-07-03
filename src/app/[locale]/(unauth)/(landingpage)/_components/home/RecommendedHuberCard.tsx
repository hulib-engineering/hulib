'use client';

import { BookOpenText, CheckCircleIcon, CircleIcon, User } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import React from 'react';

import type { Huber as THuber } from '@/libs/services/modules/huber/huberType';
import { Chip } from '@/components/core/chip/Chip';
import { mergeClassnames } from '@/components/core/private/utils';
import { HuberVerificationStatus } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/constants';

const RecommendedHuberCard = ({
  id,
  fullName,
  photo,
  verificationStatus,
  followerCount,
  bookCount,
}: Partial<THuber>) => {
  const router = useRouter();
  const profilePath = `/users/${id}`;
  const avatarConfig = genConfig(fullName ?? String(id ?? 'huber'));
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
      className="flex w-[247px] cursor-pointer flex-col gap-1.5 pb-2 text-left"
    >
      <button
        type="button"
        className="h-[247px] w-[247px]"
        onClick={() => router.push(profilePath)}
      >
        {photo?.path ? (
          <Image
            src={photo.path}
            alt={fullName ?? 'Huber Avatar'}
            width={247}
            height={247}
            className="aspect-square h-[247px] w-[247px] rounded-[28px] object-fill"
            unoptimized
            onClick={() => router.push(profilePath)}
          />
        ) : (
          <NiceAvatar
            className="aspect-square h-[247px] w-[247px] rounded-[28px]"
            {...avatarConfig}
          />
        )}
      </button>

      <div className="flex w-full flex-col gap-y-2.5">
        <div className="grid grid-cols-[auto,1fr] items-center gap-x-1.5">
          <button
            type="button"
            onClick={() => router.push(profilePath)}
          >
            <h5
              className="line-clamp-1 w-full text-left text-xl font-medium leading-7 text-primary-10"
            >
              {fullName}
            </h5>
          </button>
          {verificationStatus === HuberVerificationStatus.verified && <CheckCircleIcon size={16} className="rounded-full bg-green-60 p-px text-green-30" weight="bold" />}
          {verificationStatus === HuberVerificationStatus.challenge && <CircleIcon size={16} className="rounded-full bg-neutral-90 p-px text-neutral-60" weight="fill" />}
        </div>

        <div className="flex max-h-[56px] w-full flex-wrap items-start gap-1 overflow-hidden lg:max-h-none lg:flex-nowrap lg:items-center lg:gap-2 lg:overflow-visible">
          {visibleTopics.map(topic => (
            <Chip
              key={topic}
              as="span"
              className={mergeClassnames(
                'h-auto max-w-full rounded border px-2 py-1 text-left text-xs font-medium leading-[14px]',
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

        <div className="mt-2.5 flex flex-wrap items-center">
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <BookOpenText className="text-neutral-50" size={16} weight="bold" />
              <span className="text-sm leading-4 text-neutral-40">
                {bookCount}
                {' '}
                câu chuyện
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="text-neutral-50" size={16} weight="bold" />
              <span className="text-sm leading-4 text-neutral-40">
                {followerCount ?? 0}
                {' '}
                theo dõi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RecommendedHuberCard };
