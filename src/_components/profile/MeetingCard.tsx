'use client';

import { CalendarDotsIcon, CheckIcon, TrashIcon, UserIcon, VideoCameraIcon, XIcon } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';

import PersonRow from './PersonRow';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { useAppSelector } from '@/libs/hooks';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';
import { toLocaleTimeString } from '@/utils/dateUtils';
import type { CardVariant } from '@/features/users/types/profile';
import { BADGE_CLASS, CARD_CLASS } from '@/features/users/constants/profile.contant';
import { getCountdown, getVariant } from '@/features/users/utils/profile.util';

type MeetingCardProps = {
  session: ReadingSession;
};

export default function MeetingCard({ session }: MeetingCardProps) {
  const t = useTranslations('Time_slots');
  const locale = useLocale();
  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const [updateSession, { isLoading }] = useUpdateReadingSessionMutation();

  const isLiber = Number(userId) === Number(session.reader?.id);
  const variant = getVariant(session, isLiber);

  const startTime = toLocaleTimeString(session.startedAt, locale);
  const endTime = toLocaleTimeString(session.endedAt, locale);
  const dateStr = new Date(session.startedAt).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'vi-VN',
    { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' },
  );

  const badgeLabel: Record<CardVariant, string> = {
    right_now: t('status_right_now'),
    upcoming: getCountdown(session.startedAt),
    invitation: t('status_invitation'),
    my_request: t('status_my_request'),
    done: t('status_done'),
    missed: t('status_missed'),
  };

  const counterpart = isLiber ? session.humanBook : session.reader;
  const counterpartRole: 'huber' | 'liber' = isLiber ? 'huber' : 'liber';

  const handleUpdate = async (status: string) => {
    try {
      await updateSession({ id: Number(session.id), sessionStatus: status }).unwrap();
      pushSuccess(t('status_updated_success'));
    } catch {
      pushError(t('error_contact_admin'));
    }
  };

  return (
    <div className={mergeClassnames('flex relative flex-col gap-4 rounded-2xl p-4', CARD_CLASS[variant])}>
      {(variant === 'done' || variant === 'missed' || variant === 'my_request') && <div className="absolute inset-0 rounded-2xl bg-white opacity-30" />}
      <span className={mergeClassnames('w-fit rounded-full px-4 py-1.5 text-sm font-medium', BADGE_CLASS[variant])}>
        {variant === 'done' && <CheckIcon size={12} className="mr-1 inline" weight="bold" />}
        {badgeLabel[variant]}
      </span>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-sm text-neutral-20">
          <CalendarDotsIcon size={16} />
          <span>{t('time_label')}</span>
        </div>
        <div className="rounded-xl bg-primary-98 px-3 py-2">
          <p className="text-sm font-medium text-primary-50">{dateStr}</p>
          <p className="text-sm font-medium text-primary-50">
            {startTime}
            {' → '}
            {endTime}
          </p>
        </div>
      </div>

      {variant === 'invitation' && (
        <PersonRow
          label={t('requested_by')}
          icon={<UserIcon size={16} />}
          user={session.reader}
          // eslint-disable-next-line jsx-a11y/aria-role
          role="liber"
          showRoleBadge
        />
      )}
      {variant === 'my_request' && (
        <PersonRow
          label={t('send_to')}
          icon={<UserIcon size={16} />}
          user={session.humanBook}
        />
      )}
      {
        variant !== 'invitation' && variant !== 'my_request' && (
          <PersonRow
            label={t('meeting_with')}
            icon={<VideoCameraIcon size={16} />}
            user={counterpart}
            role={counterpartRole}
            showRoleBadge={variant === 'done'}
          />
        )
      }

      {variant === 'right_now' && (
        <a href={session.sessionUrl || '#'} target="_blank" rel="noreferrer">
          <Button fullWidth>
            <div className="flex items-center gap-1.5">
              <VideoCameraIcon size={16} />
              {t('join')}
            </div>
          </Button>
        </a>
      )}
      {variant === 'upcoming' && (
        <Button fullWidth disabled iconLeft={<VideoCameraIcon size={16} />}>
          {t('join')}
        </Button>
      )}
      {variant === 'invitation' && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            iconLeft={<XIcon size={16} />}
            disabled={isLoading}
            onClick={() => handleUpdate(StatusEnum.Rejected)}
          >
            {t('reject')}
          </Button>
          <Button
            className="flex-1"
            iconLeft={<CheckIcon size={16} />}
            animation={isLoading ? 'progress' : undefined}
            onClick={() => handleUpdate(StatusEnum.Approved)}
          >
            {t('accept')}
          </Button>
        </div>
      )}
      {variant === 'my_request' && (
        <Button
          variant="outline"
          fullWidth
          iconLeft={<TrashIcon size={16} />}
          animation={isLoading ? 'progress' : undefined}
          onClick={() => handleUpdate(StatusEnum.Canceled)}
        >
          {t('cancel_session')}
        </Button>
      )}
    </div>
  );
}
