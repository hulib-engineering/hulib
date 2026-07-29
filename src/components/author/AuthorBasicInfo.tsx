import {
  BooksIcon,
  Check,
  HeartIcon,
} from '@phosphor-icons/react';
import type { AuthorBasicInfoProps } from './private/types';
import Sessions from '@/components/SessionsSection';
import Avatar from '@/components/core/avatar/Avatar';
// import { useSession } from 'next-auth/react';
// import { memo } from 'react';

/* TODO:
- complete the UI features
*/
export default function AuthorBasicInfo(props: AuthorBasicInfoProps) {
  return (
    <Sessions>
      {/* A. Avatar and Name  */}
      <div className="isolate flex items-center gap-2">
        {/* Avatar */}
        <Avatar
          className="relative overflow-visible"
          size={props.avatarSize}
          imageUrl={props.avatarImageUrl}
          name={props.authorFullName}
        >
          <Check
            size={16}
            weight="bold"
            className="absolute bottom-0 right-0
            rounded-full bg-gradient-to-b from-blue-50 to-lavender-40 p-0.5
            text-lavender-80 ring-2 ring-lavender-80"
          />
        </Avatar>

        {/* Name */}
        <div className="items-start text-2xl font-medium leading-8 tracking-[-0.02em]">
          {props.authorFullName}
        </div>
      </div>

      {/* B. Stats */}
      <div className="flex w-full items-center justify-between">
        {/* Number of stories */}
        <div className="flex gap-1">
          <BooksIcon size={16} />
          <span className="text-sm leading-4 translate-y-0.5">
            20 câu chuyện
          </span>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          <HeartIcon size={16} color="#FF2C94" weight="fill" />
          <span className="text-sm leading-4 translate-y-0.5"> 4.2 yêu thích </span>
        </div>
      </div>
    </Sessions>
  );
}

// export default memo(AuthorBasicInfo);
