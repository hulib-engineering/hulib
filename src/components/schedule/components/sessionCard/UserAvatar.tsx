import Image from 'next/image';
import React, { useState } from 'react';

import type { User } from '../../../../libs/services/modules/user/userType';

interface UserAvatarProps {
  user: User;
  role: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, role }) => {
  const [imageError, setImageError] = useState(false);

  let bgColor = 'bg-gray-300';
  if (role === 'Huber') bgColor = 'bg-blue-200';
  if (role === 'Liber') bgColor = 'bg-yellow-200';

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor} text-sm font-medium text-gray-700`}
    >
      {user?.photo?.path && !imageError ? (
        <Image
          src={user.photo.path}
          alt={user.fullName || 'User avatar'}
          className="h-full w-full rounded-full object-cover"
          width={32}
          height={32}
          onError={() => setImageError(true)}
        />
      ) : (
        <Image
          src="/assets/images/avatar-meeting.png"
          alt="Default avatar"
          className="h-full w-full rounded-full object-cover"
          width={32}
          height={32}
        />
      )}
    </div>
  );
};
