import { Users } from '@phosphor-icons/react';
import React from 'react';

import Image from 'next/image';
import type z from 'zod';
import { useTranslations } from 'next-intl';
import { ROLE_NAME, Role } from '@/types/common';
import { ScheduleInfoItemLayout } from '@/components/schedule/ScheduleInfoItemLayout';
import type { ProfileValidation } from '@/validations/ProfileValidation';

type User = Omit<z.infer<typeof ProfileValidation>, 'isUnderGuard'> & { photo?: { path: string } };
type ISessionAttendeesProps = {
  huber: User;
  liber: User;
  isVibing: boolean;
  isAdmin?: boolean;
};

export const SessionAttendees = ({
  huber,
  liber,
  isVibing,
  isAdmin = false,
}: ISessionAttendeesProps) => {
  const t = useTranslations('ScheduleBasicInfo');

  return (
    <ScheduleInfoItemLayout icon={<Users size={16} />} title={t('attendees')}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <Image
            src={huber.photo?.path ?? '/assets/images/ava-placeholder.png'}
            alt="Huber avatar"
            className="size-8 rounded-full object-cover"
            width={32}
            height={32}
          />
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
              {huber.fullName || 'Unnamed'}
              {!isVibing && !isAdmin && ` (${t('you')})`}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <Image
            src={liber.photo?.path ?? '/assets/images/ava-placeholder.png'}
            alt="Huber avatar"
            className="size-8 rounded-full object-cover"
            width={32}
            height={32}
          />
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
              {liber?.fullName || 'Unnamed'}
              {isVibing && ` (${t('you')})`}
            </span>
          </div>
        </div>
      </div>
    </ScheduleInfoItemLayout>
  );
};
