import Image from 'next/image';
import React from 'react';

import type { User } from '../../libs/services/modules/user/userType';

interface UserAvatarProps {
  user: User;
  role: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, role }) => {
  // Use first letter of full name as fallback
  const firstLetter = user?.fullName?.charAt(0) || '?';

  // Set background color based on role
  let bgColor = 'bg-gray-300';
  if (role === 'Huber') bgColor = 'bg-blue-200';
  if (role === 'Liber') bgColor = 'bg-yellow-200';

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor} text-sm font-medium text-gray-700`}
    >
      {user?.photo?.path ? (
        <Image
          src={user.photo.path}
          alt={user.fullName || 'User avatar'}
          className="h-full w-full rounded-full object-cover"
          width={32}
          height={32}
        />
      ) : (
        <span>{firstLetter}</span>
      )}
    </div>
  );
};
