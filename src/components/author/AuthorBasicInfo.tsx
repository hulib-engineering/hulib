import {
  BooksIcon,
  CheckIcon,
  HeartIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { mergeClassnames } from '../core/private/utils';
import Section from '@/components/Section';
import Avatar from '@/components/core/avatar/Avatar';

import type { User } from '@/features/users/types';

export type AuthorBasicInfoProps = {
  humanBook: User | undefined;
  numStories: number;
  type?: 'hovercard' | 'default';
  onClickFunction?: () => void;
};

// TODO: add the var to 'rating' section once the api response for its value has been added
// modify 'numStories' var if its API value for Huber is created

export default function AuthorBasicInfo({ humanBook, numStories = 0, type = 'default', onClickFunction }: AuthorBasicInfoProps) {
  const isDefault = type === 'default';
  const t = useTranslations('AuthorBasicInfo');
  const tExploreStory = useTranslations('ExploreStory');

  const ButtonTag = isDefault ? 'button' : React.Fragment;
  const ButtonProps = { type: 'button', onClick: onClickFunction } as const;

  return (
    <Section title={isDefault ? tExploreStory('author') : undefined}>
      {/* UPPER HALF */}
      <ButtonTag {...(isDefault ? ButtonProps : {})}>
        <div className="group isolate flex items-center gap-2">
          {/* Avatar */}
          <Avatar
            className="relative overflow-visible"
            size={!isDefault ? '2xl' : 'md'}
            imageUrl={humanBook?.photo?.path}
            name={humanBook?.fullName}
          >
            <CheckIcon
              size={16}
              weight="bold"
              className="absolute bottom-0 right-0
              rounded-full bg-gradient-to-b from-blue-50 to-lavender-40 p-0.5
              text-lavender-80 ring-2 ring-lavender-80"
            />
          </Avatar>

          {/* Name */}
          <span className={mergeClassnames('line-clamp-1 font-medium', isDefault && 'leading-7 text-[18px] text-primary-50 hover:cursor-pointer group-hover:underline', !isDefault && 'leading-8 tracking-[-0.02em] items-start text-2xl')}>
            {humanBook?.fullName}
          </span>
        </div>
      </ButtonTag>
      {/* LOWER HALF */}
      <div className="flex w-full justify-between text-sm font-normal">
        {/* Number of stories */}
        <div className="flex items-center gap-1">
          <BooksIcon size={16} />
          <span className={mergeClassnames('leading-4 font-medium mt-1', !isDefault && 'translate-y-0.5 mt-0')}>
            {numStories}
          </span>
          {t('stories')}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <HeartIcon size={16} color="#FF2C94" weight="fill" />
          <span className={mergeClassnames('leading-4 font-medium mt-1', !isDefault && 'translate-y-0.5 mt-0')}>
            {0}
          </span>
          {t('rating')}
        </div>
      </div>
    </Section>
  );
}
