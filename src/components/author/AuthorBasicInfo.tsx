import {
  BooksIcon,
  CheckIcon,
  HeartIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
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

type HasButtonProps = {
  children: ReactNode;
  isDefault: boolean;
  onClickFunction?: () => void;
};
// TODO: add the var to 'rating' section once the api response for its value has been added
// modify 'numStories' var if its API value for Huber is created

function HasButton({ isDefault, onClickFunction, children }: HasButtonProps) {
  return isDefault ? children : <button type="button" onClick={onClickFunction}>{children}</button>;
}

export default function AuthorBasicInfo({ humanBook, numStories = 0, type = 'default', onClickFunction }: AuthorBasicInfoProps) {
  const t = useTranslations('AuthorBasicInfo');

  return (
    <Section title={type === 'default' ? 'Author' : undefined}>
      {/* UPPER HALF */}
      <HasButton
        isDefault={type === 'default'}
        onClickFunction={onClickFunction}
      >
        <div className="isolate flex items-center gap-2">
          {/* Avatar */}
          <Avatar
            className="relative overflow-visible"
            size={type === 'hovercard' ? '2xl' : 'md'}
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
          <div className={mergeClassnames('line-clamp-1 font-medium', type === 'default' && 'leading-7 text-[18px] text-primary-50 hover:cursor-pointer hover:underline', type === 'hovercard' && 'leading-8 tracking-[-0.02em] items-start text-2xl')}>
            {humanBook?.fullName}
          </div>
        </div>
      </HasButton>
      {/* LOWER HALF */}
      <div className="flex w-full justify-between text-sm font-normal">
        {/* Number of stories */}
        <div className="flex items-center gap-1">
          <BooksIcon size={16} />
          <span className={mergeClassnames('leading-4 font-medium mt-1', type === 'hovercard' && 'translate-y-0.5 mt-0')}>
            {numStories}
          </span>
          {t('stories')}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <HeartIcon size={16} color="#FF2C94" weight="fill" />
          <span className={mergeClassnames('leading-4 font-medium mt-1', type === 'hovercard' && 'translate-y-0.5 mt-0')}>
            {0}
          </span>
          {t('rating')}
        </div>
      </div>
    </Section>
  );
}
