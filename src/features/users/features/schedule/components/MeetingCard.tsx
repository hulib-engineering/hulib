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
import { GreenTick } from '@/features/users/components/profile/GreenTick';
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
  const isCounterpartLiber = counterpart?.role?.name === ROLE_NAME[Role.LIBER];

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

  const runUpdate = async (payload: Record<string, unknown>) => {
    try {
      await updateStatus({ id: session.id, ...payload } as any).unwrap();
      pushSuccess(t('success.updated'));
      setIsAcceptOpen(false);
      setIsRejectOpen(false);
      setIsDeleteOpen(false);
    } catch {
      pushError(t('error.updated'));
    }
  };

  const canJoin = Boolean(session.sessionUrl);
  const labelTone = isMuted ? 'text-neutral-40' : 'text-neutral-10';
  const blockTone = isMuted ? 'text-neutral-40' : 'text-primary-50';

  return (
    <div
      className={mergeClassnames(
        // No border here on purpose: only some variants are outlined. `CARD_CLASS` supplies
        // `border-4` / `border-2` / `border` where the design calls for it, and `done` /
        // `missed` carry none at all.
        'flex w-full max-w-[304px] flex-col items-start gap-5 rounded-2xl p-4 font-medium',
        CARD_CLASS[variant],
      )}
    >
      <div className="flex w-full flex-col items-start gap-5">
        <span
          className={mergeClassnames(
            'flex h-8 items-center justify-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium leading-4',
            BADGE_CLASS[variant],
          )}
        >
          {badgeLabel}
        </span>

        {/* Time */}
        <div className="flex w-full flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <CalendarDots className="size-4 shrink-0 text-[#343330]" />
            <span className={mergeClassnames('text-sm font-medium leading-4', labelTone)}>
              {t('time_label')}
            </span>
          </div>
          <div className="flex w-full flex-wrap items-start rounded bg-primary-98 p-1">
            <span className={mergeClassnames('text-base font-medium leading-6', blockTone)}>
              {dateLabel}
            </span>
            <div className="flex items-center gap-4">
              <span className={mergeClassnames('text-base font-medium leading-6', blockTone)}>
                {startLabel}
              </span>
              <ArrowRight className="size-4 shrink-0 text-neutral-60" />
              <span className={mergeClassnames('text-base font-medium leading-6', blockTone)}>
                {endLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Attendee */}
        <div className="flex w-full flex-col items-start gap-1.5">
          <div className="flex items-center gap-2">
            {isRequest
              ? <UserIcon className="size-4 shrink-0 text-[#343330]" />
              : <VideoCamera className="size-4 shrink-0 text-[#343330]" />}
            <span className={mergeClassnames('text-sm font-medium leading-4', labelTone)}>
              {isRequest ? t('send_to') : tSchedule('meeting_with')}
            </span>
          </div>
          <div className="flex w-full items-center gap-1">
            <Avatar
              imageUrl={counterpart?.photo?.path}
              name={counterpart?.fullName ?? undefined}
              size="sm"
              className="size-8 rounded-full border border-neutral-98"
            />
            {isCounterpartLiber
              ? (
                  <Chip
                    as="span"
                    className="size-fit rounded-[100px] border border-yellow-70 bg-yellow-90 px-2 py-0.5 text-xs font-medium leading-4 text-orange-50"
                  >
                    {ROLE_NAME[Role.LIBER]}
                  </Chip>
                )
              : <GreenTick size={10} weight="bold" />}
            <span className={mergeClassnames(
              'line-clamp-1 flex-1 text-base font-medium leading-5',
              isMuted ? 'text-neutral-40' : 'text-primary-40',
            )}
            >
              {counterpart?.fullName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {(variant === 'right_now' || variant === 'upcoming') && (
          // The icon is a child, not the `iconLeft` prop: on a `fullWidth` Button that prop
          // renders absolutely positioned at the button's left edge, which detaches it from
          // the label. As a child it stays inline, and `size="sm"` supplies the 6px gap.
          <Button
            size="sm"
            fullWidth
            disabled={!canJoin}
            className="text-primary-98 enabled:hover:bg-primary-40"
            onClick={() => session.sessionUrl && router.push(session.sessionUrl)}
          >
            <VideoCamera className="size-4 shrink-0 text-primary-98" />
            <span>{t('join')}</span>
          </Button>
        )}
        {variant === 'invitation' && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" fullWidth onClick={() => setIsRejectOpen(true)}>
              {tSchedule('reject')}
            </Button>
            <Button
              size="sm"
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
            size="sm"
            fullWidth
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash className="size-4 shrink-0" />
            <span>{tCommon('delete')}</span>
          </Button>
        )}
      </div>

      <MeetingDecisionModal
        open={isAcceptOpen}
        type="accept"
        session={session as any}
        sender={counterpart as any}
        isLoading={isLoading}
        onConfirm={() => runUpdate({ sessionStatus: StatusEnum.Approved })}
        onClose={() => setIsAcceptOpen(false)}
      />
      <MeetingDecisionModal
        open={isRejectOpen}
        type="reject"
        session={session as any}
        sender={counterpart as any}
        isLoading={isLoading}
        onConfirm={reason => runUpdate({
          sessionStatus: StatusEnum.Rejected,
          rejectReason: reason,
        })}
        onClose={() => setIsRejectOpen(false)}
      />
      <ConfirmModal
        isOpen={isDeleteOpen}
        title={tSchedule('cancel')}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => runUpdate({ sessionStatus: StatusEnum.Canceled })}
      />
    </div>
  );
}
