import { UserIcon } from '@phosphor-icons/react';

import UserAvatar from './UserAvatar';
import { mergeClassnames } from '@/components/core/private/utils';
import { ROLE_NAME, Role } from '@/types/common';

type UserInfo = {
  photo?: { path: string };
  fullName?: string;
};

type PersonRowProps = {
  label: string;
  icon?: React.ReactNode;
  user: UserInfo;
  role?: 'huber' | 'liber';
  showRoleBadge?: boolean;
};

export default function PersonRow({
  label,
  icon = <UserIcon size={16} />,
  user,
  role,
  showRoleBadge = false,
}: PersonRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="z-auto flex items-center gap-1.5 text-sm text-neutral-20">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <UserAvatar photo={user?.photo} fallbackSeed={user?.fullName || 'user'} size="sm" />
        {showRoleBadge && role && (
          <span className={mergeClassnames(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            role === 'huber' ? 'bg-primary-90 text-primary-50' : 'bg-yellow-90 text-yellow-40',
          )}
          >
            {role === 'huber' ? ROLE_NAME[Role.HUBER] : ROLE_NAME[Role.LIBER]}
          </span>
        )}
        <span className="text-sm font-medium text-neutral-10">{user?.fullName}</span>
      </div>
    </div>
  );
}
