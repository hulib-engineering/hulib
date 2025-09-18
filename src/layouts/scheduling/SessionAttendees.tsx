import { Users } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import React from 'react';
import type z from 'zod';

import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { mergeClassnames } from '@/components/private/utils';
import Avatar from '@/components/avatar/Avatar';
import { Chip } from '@/components/common/chip/Chip';
import { ROLE_NAME, Role } from '@/types/common';
import type { ProfileValidation } from '@/validations/ProfileValidation';

type User = Omit<z.infer<typeof ProfileValidation>, 'isUnderGuard'> & { photo?: { path: string } };
type ISessionAttendeesProps = {
  huber: User;
  liber: User;
  isVibing: boolean;
  isAdmin?: boolean;
  classname?: string;
  childClassname?: string;
  icon?: ReactNode;
  showParticipantOnly?: boolean;
};

export const SessionAttendees = ({
  huber,
  liber,
  isVibing,
  isAdmin = false,
  classname,
  childClassname,
  icon,
  showParticipantOnly = false,
}: ISessionAttendeesProps) => {
  const t = useTranslations('ScheduleBasicInfo');

  if (showParticipantOnly) {
    return (
      <div className={mergeClassnames('flex items-center gap-2 text-sm text-black', classname)}>
        {icon ?? <Users size={16} className="text-[#343330]" />}
        <div className="flex items-center gap-1">
          <Avatar
            size="sm"
            imageUrl={isVibing ? huber?.photo?.path : liber?.photo?.path
              ?? '/assets/images/ava-placeholder.png'}
          />
          <Chip
            disabled
            className={mergeClassnames(
              '!size-fit rounded-[100px] px-2.5 py-0.5 opacity-100 text-xs font-medium leading-4',
              isVibing ? 'bg-primary-90 text-primary-50' : 'bg-yellow-90 text-yellow-40',
            )}
          >
            {isVibing ? ROLE_NAME[Role.HUBER] : ROLE_NAME[Role.LIBER]}
          </Chip>
          <span className="text-sm font-medium text-neutral-10">
            {isVibing ? huber?.fullName : liber?.fullName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <ScheduleInfoItemLayout icon={icon ?? <Users size={16} />} title={t('attendees')} className={classname}>
      <div className={mergeClassnames('flex flex-col space-y-2', childClassname)}>
        <div className="flex items-center">
          <Image
            src={huber?.photo?.path ?? '/assets/images/ava-placeholder.png'}
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
              {huber?.fullName || 'Unnamed'}
              {!isVibing && !isAdmin && ` (${t('you')})`}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <Image
            src={liber?.photo?.path ?? '/assets/images/ava-placeholder.png'}
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
