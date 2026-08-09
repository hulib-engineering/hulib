import {
  BooksIcon,
  CheckIcon,
  HeartIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import Section from '@/components/Section';
import Avatar from '@/components/core/avatar/Avatar';

import type { SizeProps } from '@/components/core/avatar/private/types';
import type { User } from '@/features/users/types';
import type { GetHuberStoriesResponse } from '@/libs/services/modules/stories/storiesType';

export type AuthorBasicInfoProps = {
  avatarSize?: SizeProps; // sm, md, xl, 2xl, etc..
  humanBook: User;
  stories: GetHuberStoriesResponse;
};
// TODO: add the var to 'rating' section once the api response for its value has been added
// modify 'number of stories' var as well once the API value for it for Huber is created
export default function AuthorBasicInfo({ humanBook, avatarSize, stories }: AuthorBasicInfoProps) {
  const t = useTranslations('AuthorBasicInfo');

  return (
    <Section>
      {/* UPPER HALF */}
      <div className="isolate flex items-center gap-2">
        {/* Avatar */}
        <Avatar
          className="relative overflow-visible"
          size={avatarSize}
          imageUrl={humanBook.photo?.path}
          name={humanBook.fullName}
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
        <div className="items-start text-2xl font-medium leading-8 tracking-[-0.02em]">
          {humanBook.fullName}
        </div>
      </div>

      {/* LOWER HALF */}
      <div className="flex w-full items-center justify-between">
        {/* Number of stories */}
        <div className="flex gap-1">
          <BooksIcon size={16} />
          <span className="text-sm leading-4 translate-y-0.5">{`${stories?.data?.length ?? 0} ${t('stories')}`}</span>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          <HeartIcon size={16} color="#FF2C94" weight="fill" />
          <span className="text-sm leading-4 translate-y-0.5">{`${0} ${t('rating')}`}</span>
        </div>
      </div>
    </Section>
  );
}

// export default memo(AuthorBasicInfo);
