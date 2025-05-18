import { Users } from '@phosphor-icons/react';
import React from 'react';

import { Role, ROLE_NAME } from '@/types/common';

import type { User } from '../../../../libs/services/modules/user/userType';
import { UserAvatar } from './UserAvatar';

interface SessionAttendeesProps {
  humanBook: User;
  reader: User;
  isVibing?: boolean;
}

export const SessionAttendees: React.FC<SessionAttendeesProps> = ({
  humanBook,
  reader,
  isVibing,
}) => {
  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center text-sm text-black">
        <Users size={16} className="mr-2" />
        <span>2 Attendees</span>
      </div>

      <div className="ml-5 flex flex-col space-y-2">
        <div className="flex items-center">
          <UserAvatar user={humanBook} role="presentation" />
          <div className="ml-2">
            <span
              className="mr-1 rounded-[100px] px-2 py-0.5 text-xs"
              style={{
                backgroundColor: 'rgba(205, 221, 254, 1)',
                color: 'rgba(4, 66, 191, 1)',
              }}
            >
              {ROLE_NAME[Role.HUBER]}
            </span>
            <span className="text-sm font-medium text-black">
              {humanBook?.fullName || 'Unnamed'}
              {!isVibing && ' (You)'}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <UserAvatar user={reader} role="presentation" />
          <div className="ml-2">
            <span
              className="mr-1 rounded-[100px] px-2 py-0.5 text-xs"
              style={{
                backgroundColor: 'rgba(253, 243, 206, 1)',
                color: 'rgba(219, 174, 10, 1)',
              }}
            >
              {ROLE_NAME[Role.LIBER]}
            </span>
            <span className="text-sm font-medium text-black">
              {reader?.fullName || 'Unnamed'}
              {isVibing && ' (You)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
