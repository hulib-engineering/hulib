'use client';

import {
  ArrowRight,
  CalendarDots,
  Trash,
  User as UserIcon,
  VideoCamera,
} from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import type { MeetingCardModel } from '../types';
import { getTimeLeft } from '../utils/variant';
import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import { ConfirmModal } from '@/components/ConfirmModal';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import MeetingDecisionModal from '@/components/notification/styles/MeetingDecisionModal';
import { mergeClassnames } from '@/components/core/private/utils';
import { useRouter } from '@/libs/i18nNavigation';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import { ROLE_NAME, Role, StatusEnum } from '@/types/common';
import { formatSessionDateWithWeekday, formatSessionTime } from '@/utils/dateUtils';
import { BADGE_CLASS, CARD_CLASS } from '@/features/users/constants/profile.contant';

type MeetingCardProps = {
  card: MeetingCardModel;
  now?: Date;
};

/** Variants the design renders without any action and with muted copy. */
const MUTED_VARIANTS = ['done', 'missed'] as const;

export default function MeetingCard({ card, now = new Date() }: MeetingCardProps) {
  const { session, variant, counterpart } = card;
  const t = useTranslations('Schedule.meeting_list');
  const tSchedule = useTranslations('Schedule');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();

  const [updateStatus, { isLoading }] = useUpdateReadingSessionMutation();
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isMuted = (MUTED_VARIANTS as readonly string[]).includes(variant);
  const isRequest = variant === 'invitation' || variant === 'my_request';

  const dateLabel = formatSessionDateWithWeekday(session.startedAt, locale);
  const startLabel = formatSessionTime(session.startTime, locale);
  const endLabel = formatSessionTime(session.endTime, locale);
  const { days, hours } = getTimeLeft(session.startedAt, now);

  const badgeLabel = (() => {
    switch (variant) {
      case 'right_now':
        return t('badge.right_now');
      case 'upcoming':
        return t('badge.time_left', { days, hours });
      case 'invitation':
        return t('badge.invitation');
      case 'my_request':
        return t('badge.my_request');
      case 'done':
        return tSchedule('done');
      case 'missed':
        return tSchedule('missed');
      default:
        return '';
    }
  })();

  const runUpdate = async (payload: Record<string, unknown>, successMessage: string) => {
    try {
      await updateStatus({ id: session.id, ...payload } as any).unwrap();
      pushSuccess(successMessage);
      setIsAcceptOpen(false);
      setIsRejectOpen(false);
      setIsDeleteOpen(false);
    } catch {
      pushError(t('error.updated'));
    }
  };

  const handleDelete = () => runUpdate(
    { sessionStatus: StatusEnum.Canceled },
    t('success.updated'),
  );

  const canJoin = Boolean(session.sessionUrl);

  return (
    <div
      className={mergeClassnames(
        'flex h-full flex-col gap-4 rounded-2xl px-5 py-4 font-medium',
        CARD_CLASS[variant],
        isMuted && 'text-neutral-40',
      )}
    >
      <span
        className={mergeClassnames(
          'w-fit rounded-full px-4 py-2 text-sm font-medium leading-4',
          BADGE_CLASS[variant],
        )}
      >
        {badgeLabel}
      </span>

      <div className="flex flex-col gap-1.5">
        <div className={mergeClassnames('flex items-center gap-1.5 text-sm', isMuted ? 'text-neutral-40' : 'text-neutral-20')}>
          <CalendarDots className="size-4 shrink-0 text-[#343330]" />
          <span>{t('time_label')}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl bg-primary-98 px-3 py-2">
          <span className={mergeClassnames(
            'text-base font-medium leading-5',
            isMuted ? 'text-neutral-40' : 'text-primary-50',
          )}
          >
            {dateLabel}
          </span>
          <div className="flex items-center gap-2">
            <span className={mergeClassnames(
              'text-base font-medium leading-5',
              isMuted ? 'text-neutral-40' : 'text-primary-50',
            )}
            >
              {startLabel}
            </span>
            <ArrowRight className="size-4 shrink-0 text-primary-60" />
            <span className={mergeClassnames(
              'text-base font-medium leading-5',
              isMuted ? 'text-neutral-40' : 'text-primary-50',
            )}
            >
              {endLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className={mergeClassnames('flex items-center gap-1.5 text-sm', isMuted ? 'text-neutral-40' : 'text-neutral-20')}>
          {isRequest
            ? <UserIcon className="size-4 shrink-0 text-[#343330]" />
            : <VideoCamera className="size-4 shrink-0 text-[#343330]" />}
          <span>{isRequest ? t('send_to') : tSchedule('meeting_with')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Avatar
            imageUrl={counterpart?.photo?.path}
            name={counterpart?.fullName ?? undefined}
            size="sm"
          />
          <Chip
            as="span"
            className={mergeClassnames(
              '!size-fit rounded-[100px] px-2.5 py-0.5 text-xs font-medium leading-4',
              counterpart?.role?.name === ROLE_NAME[Role.LIBER]
                ? 'bg-yellow-90 text-orange-50'
                : 'bg-primary-90 text-primary-50',
            )}
          >
            {counterpart?.role?.name ?? ''}
          </Chip>
          <span className={mergeClassnames(
            'line-clamp-1 text-sm font-medium',
            isMuted ? 'text-neutral-40' : 'text-neutral-10',
          )}
          >
            {counterpart?.fullName}
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-1">
        {(variant === 'right_now' || variant === 'upcoming') && (
          <Button
            size="lg"
            fullWidth
            disabled={!canJoin}
            iconLeft={<VideoCamera />}
            onClick={() => session.sessionUrl && router.push(session.sessionUrl)}
          >
            {canJoin ? t('join') : tSchedule('tbu')}
          </Button>
        )}
        {variant === 'invitation' && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" fullWidth onClick={() => setIsRejectOpen(true)}>
              {tSchedule('reject')}
            </Button>
            <Button
              size="lg"
              fullWidth
              animation={isLoading && 'progress'}
              onClick={() => setIsAcceptOpen(true)}
            >
              {tSchedule('accept')}
            </Button>
          </div>
        )}
        {variant === 'my_request' && (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            iconLeft={<Trash />}
            onClick={() => setIsDeleteOpen(true)}
          >
            {tCommon('delete')}
          </Button>
        )}
      </div>

      <MeetingDecisionModal
        open={isAcceptOpen}
        type="accept"
        session={session as any}
        sender={counterpart as any}
        isLoading={isLoading}
        onConfirm={() => runUpdate({ sessionStatus: StatusEnum.Approved }, t('success.updated'))}
        onClose={() => setIsAcceptOpen(false)}
      />
      <MeetingDecisionModal
        open={isRejectOpen}
        type="reject"
        session={session as any}
        sender={counterpart as any}
        isLoading={isLoading}
        onConfirm={reason => runUpdate(
          { sessionStatus: StatusEnum.Rejected, rejectReason: reason },
          t('success.updated'),
        )}
        onClose={() => setIsRejectOpen(false)}
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        title={tSchedule('cancel')}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
