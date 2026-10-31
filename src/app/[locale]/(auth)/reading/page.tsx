'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useAppSelector } from '@/libs/hooks';
import { useRouter } from '@/libs/i18nNavigation';
import {
  useEndReadingSessionMutation,
  useGetReadingSessionByIdQuery,
} from '@/libs/services/modules/reading-session';
import PreSurvey from '@/layouts/reading/PreSurvey';
import Loading from '@/app/[locale]/loading';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { StatusEnum } from '@/types/common';
import { readAgoraToken } from '@/features/meeting/utils/agoraToken';

// The meeting room touches `window` and the Agora SDK on mount, so it must not
// be server-rendered.
const MeetingShell = dynamic(
  () => import('@/features/meeting/components/MeetingShell').then(mod => mod.MeetingShell),
  {
    ssr: false,
  },
);

const TERMINAL_SESSION_STATUSES = new Set([
  StatusEnum.Finished,
  StatusEnum.Canceled,
  StatusEnum.Missed,
  StatusEnum.Rejected,
]);

function isTerminalSessionStatus(status: string | undefined): boolean {
  if (!status) {
    return false;
  }
  return TERMINAL_SESSION_STATUSES.has(status as StatusEnum)
    || TERMINAL_SESSION_STATUSES.has(status.toLowerCase() as StatusEnum);
}

export default function ReadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Reading.AgoraMeeting');
  const channel = searchParams.get('channel');
  const sessionId = channel?.split('-')?.[1];

  // "+" in the query string decodes to a space; join() needs it repaired.
  const token = useMemo(() => readAgoraToken(searchParams.toString()), [searchParams]);

  const { data: readingSession } = useGetReadingSessionByIdQuery(sessionId || 0, {
    skip: !sessionId,
  });
  const [endReadingSession] = useEndReadingSessionMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  // Set when the survey is skipped or finished in this visit; a successful submit also writes the localStorage flag
  const [isDoneSurveyForReading, setIsDoneSurveyForReading] = useState(false);

  // Block Agora for sessions that are already finished/canceled/missed/rejected.
  useEffect(() => {
    if (!readingSession) {
      return;
    }
    if (isTerminalSessionStatus(readingSession.sessionStatus)) {
      const isFinished
        = readingSession.sessionStatus === StatusEnum.Finished
          || readingSession.sessionStatus?.toLowerCase() === StatusEnum.Finished;
      router.replace(isFinished ? '/notifications' : '/my-schedule');
    }
  }, [readingSession, router]);

  const handleEndCall = async () => {
    if (!sessionId) {
      router.push('/notifications');
      return;
    }

    try {
      await endReadingSession({ id: sessionId }).unwrap();
      pushSuccess(t('session_finished'));
    } catch {
      // Backend is idempotent; a race where the peer already finished still
      // counts as success for leaving the room.
      pushError(t('session_finish_failed'));
    } finally {
      router.push('/notifications');
    }
  };

  // Wait for the user and session so AgoraMeeting never mounts (and joins the channel) before the survey decision
  if (!readingSession || !userInfo.id) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isTerminalSessionStatus(readingSession.sessionStatus)) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isViewerLiber = Number(userInfo.id) === Number(readingSession.reader?.id);
  const isHuber = userInfo.id === readingSession.humanBook.id;
  const hasSavedSurvey = localStorage.getItem(`is_done_survey_for_reading_${readingSession.id}`) === 'true';
  const needsSurvey = !isHuber && !hasSavedSurvey && !isDoneSurveyForReading;

  return (
    <div className="flex size-full items-center justify-center">
      {needsSurvey ? (
        <PreSurvey
          sessionId={Number.parseInt(sessionId || '0', 10)}
          onFinish={() => setIsDoneSurveyForReading(true)}
        />
      ) : (
        <MeetingShell
          channel={channel || ''}
          token={token}
          sessionId={sessionId}
          endedAt={readingSession.endedAt}
          storyTitle={readingSession.story?.title ?? ''}
          localUser={{
            id: String(userInfo.id),
            name: userInfo.fullName,
            avatarUrl: userInfo.photo?.path,
          }}
          remoteParticipant={{
            id: isViewerLiber
              ? readingSession.humanBook?.id
              : readingSession.reader?.id,
            name: isViewerLiber
              ? readingSession.humanBook?.fullName
              : readingSession.reader?.fullName,
            avatarUrl: isViewerLiber
              ? readingSession.humanBook?.photo?.path
              : readingSession.reader?.photo?.path,
          }}
          isViewerLiber={isViewerLiber}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
}
