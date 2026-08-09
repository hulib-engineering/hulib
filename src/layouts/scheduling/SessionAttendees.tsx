import { CheckIcon, UserIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import React from 'react';
import type z from 'zod';
import NiceAvatar, { genConfig } from 'react-nice-avatar';

import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { mergeClassnames } from '@/components/core/private/utils';
import Avatar from '@/components/core/avatar/Avatar';
import { Chip } from '@/components/core/chip/Chip';
import { ROLE_NAME, Role } from '@/types/common';
import type { ProfileValidation } from '@/validations/ProfileValidation';
// import type { User as Huber }  from '@/features/users/types'

// TODO: create a different type for Huber, if API response schema of getUser and getHuber turned out to be different
type User = Omit<z.infer<typeof ProfileValidation>, 'isUnderGuard'> & { photo?: { path: string }; role?: { name: string } };
export type ISessionAttendeesProps = {
  bookedHuber: User;
  me: User;
  isVibing: boolean;
  isAdmin?: boolean;
  classname?: string;
  childClassname?: string;
  icon?: ReactNode;
  showParticipantOnly?: boolean;
};

function Attendee({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-1">
      {user?.photo?.path ? (
        <Avatar
          size="sm"
          imageUrl={user.photo.path}
        />
      ) : (
        <NiceAvatar
          className="size-8 rounded-full"
          {...genConfig(user?.fullName || 'user')}
        />
      )}
      <div className="flex flex-row items-center">
        {user?.role?.name === 'Liber' ? (
          <span
            className="mr-1 rounded-[100px] border border-yellow-70 bg-yellow-90
          px-2 py-0.5
          text-sm text-orange-50"
          >
            {ROLE_NAME[Role.LIBER]}
          </span>
        ) : (
          <CheckIcon
            size={16}
            weight="bold"
            className="bottom-0 right-0 ml-[2px] mr-[5px]
          rounded-full bg-gradient-to-b from-blue-50 to-lavender-40 p-0.5
          text-lavender-80 ring-2 ring-lavender-80"
          />
        )}
        <span className="font-medium">
          {user?.fullName || 'Unnamed'}
          {/*! isVibing && !isAdmin && ` (${t('you')})` */}
        </span>
      </div>
    </div>
  );
}

export const SessionAttendees = ({
  bookedHuber,
  me,
  isVibing,
  // isAdmin = false,
  classname,
  childClassname,
  icon,
  showParticipantOnly = false,
}: ISessionAttendeesProps) => {
  const t = useTranslations('ScheduleBasicInfo');

  if (showParticipantOnly) {
    return (
      <div className={mergeClassnames('flex items-center gap-2 text-sm text-black', classname)}>
        {icon ?? <UserIcon size={16} className="text-[#343330]" />}
        <div className="flex items-center gap-1">
          {(isVibing ? bookedHuber?.photo?.path : me?.photo?.path) ? (
            <Avatar
              size="sm"
              imageUrl={isVibing ? bookedHuber?.photo?.path : me?.photo?.path}
            />
          ) : (
            <NiceAvatar
              className="size-8 rounded-full"
              {...genConfig((isVibing ? bookedHuber?.fullName : me?.fullName) || 'user')}
            />
          )}
          <Chip
            className={mergeClassnames(
              '!size-fit rounded-[100px] px-2.5 py-0.5 opacity-100 text-xs font-medium leading-4',
              isVibing ? 'bg-primary-90 text-primary-50' : 'bg-yellow-90 text-yellow-40',
            )}
          >
            {isVibing ? ROLE_NAME[Role.HUBER] : ROLE_NAME[Role.LIBER]}
          </Chip>
          <span className="text-sm font-medium text-neutral-10">
            {isVibing ? bookedHuber?.fullName : me?.fullName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <ScheduleInfoItemLayout icon={icon ?? <UserIcon size={16} className="mb-1" />} title={t('attendees')} className={classname}>
      <div className={mergeClassnames('flex flex-col space-y-2', childClassname)}>
        <Attendee user={me} />
        <Attendee user={bookedHuber} />
      </div>
    </ScheduleInfoItemLayout>
  );
};
