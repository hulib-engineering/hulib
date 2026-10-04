'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import Button from '@/components/core/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import { useAppSelector } from '@/libs/hooks';
import { useRouter } from '@/libs/i18nNavigation';
import SessionDetailCard from '@/layouts/scheduling/SessionDetailCard';
import { useGetReadingSessionByIdQuery } from '@/libs/services/modules/reading-session';
import { StatusEnum } from '@/types/common';

/**
 * Per-session deep link for the session-outcome notifications (`missReadingSession`,
 * `huberNoShowReadingSession`, `autoCancelReadingSession`).
 *
 * Deliberately built around `relatedEntity.id` rather than `sessionUrl`: for these outcomes the
 * session is already over or dead, so the Agora link would drop the reader into a finished room.
 * The page shows the recorded status instead.
 */
export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations('Schedule');
  const tCommon = useTranslations('Common');

  const sessionId = Number(params?.id);
  const userId = useAppSelector(state => state.auth.userInfo?.id);

  const { data: session, isLoading, isError } = useGetReadingSessionByIdQuery(sessionId, {
    skip: !Number.isFinite(sessionId) || sessionId <= 0,
  });

  // The sharing form is only meaningful to the Huber who was recorded as absent. For the reader
  // the same card renders without it.
  const isHuber = Number(userId) === Number(session?.humanBook?.id);
  const isMissed = session?.sessionStatus === StatusEnum.Missed;

  const handleRebook = () => {
    const storyId = session?.storyId ?? session?.story?.id;
    if (!storyId) {
      pushError(tCommon('could_not_find_resource'));
      return;
    }
    router.push(`/explore-story/${storyId}/booking`);
  };

  if (!Number.isFinite(sessionId) || sessionId <= 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <p className="text-neutral-40">{tCommon('could_not_find_resource')}</p>
        <Button size="sm" onClick={() => router.push('/my-schedule')}>{t('view_on_schedule')}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          size="sm"
          variant="ghost"
          iconLeft={<ArrowLeft />}
          onClick={() => router.push('/my-schedule')}
        >
          {t('view_on_schedule')}
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-2xl bg-neutral-98 p-6 text-neutral-40">{tCommon('loading')}</div>
      )}

      {!isLoading && isError && (
        <div className="rounded-2xl bg-neutral-98 p-6 text-neutral-40">{tCommon('could_not_find_resource')}</div>
      )}

      {!isLoading && !isError && session && (
        <>
          <SessionDetailCard
            session={session}
            expandByDefault
            sharingMissingReason={isMissed && isHuber}
          />

          {session.sessionStatus === StatusEnum.Canceled && (
            <Button size="sm" fullWidth onClick={handleRebook}>
              {tCommon('book_again')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
