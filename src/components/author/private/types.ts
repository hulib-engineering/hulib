import type { SizeProps } from '@/components/core/avatar/private/types';
import type { User } from '@/features/users/types';

export type AuthorBasicInfoProps = {
  avatarSize?: SizeProps; // sm, md, xl, 2xl, etc..
  avatarImageUrl: NonNullable<User['photo']>['path'] | undefined;
  authorFullName: User['fullName'] | undefined;
  numStories: number;
  numRating: number;
};
