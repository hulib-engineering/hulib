'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useAppSelector } from '@/libs/hooks';
import { useRouter } from '@/libs/i18nNavigation';
import type { ReadingSessionFeedbackPayload } from '@/libs/services/modules/reading-session';
import {
  useEndReadingSessionMutation,
  useGetReadingSessionByIdQuery,
  useSubmitReadingSessionFeedbackMutation,
} from '@/libs/services/modules/reading-session';
import PreSurvey from '@/layouts/reading/PreSurvey';
import Loading from '@/app/[locale]/loading';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { StatusEnum } from '@/types/common';
import { readAgoraToken } from '@/features/meeting/utils/agoraToken';
import { resolveMeetingEndAt } from '@/features/meeting/utils/resolveMeetingEndAt';
import { PostMeetingFeedbackModal } from '@/features/meeting/components/feedback/PostMeetingFeedbackModal';

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

  const {
    data: readingSession,
    isLoading: isSessionLoading,
    error: sessionError,
    refetch: refetchReadingSession,
  } = useGetReadingSessionByIdQuery(sessionId || 0, {
    skip: !sessionId,
  });
  const [endReadingSession] = useEndReadingSessionMutation();
  const [submitReadingSessionFeedback] = useSubmitReadingSessionFeedbackMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  /**
   * Hang-up instant: API `endedAt` (ISO). Never interpret `endTime` as local
   * clock hours — that is what armed 00:00Z and ended the call on join.
   */
  const effectiveEndedAt = useMemo(() => {
    if (!readingSession) {
      return undefined;
    }

    return resolveMeetingEndAt(readingSession)?.toISOString();
  }, [readingSession]);

  // Set when the survey is skipped or finished in this visit; a successful submit also writes the localStorage flag
  const [isDoneSurveyForReading, setIsDoneSurveyForReading] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFeedbackDoneInVisit, setIsFeedbackDoneInVisit] = useState(false);

  const isViewerLiber = !!readingSession
    && Number(userInfo.id) === Number(readingSession.reader?.id);
  const isHuber = !!readingSession
    && String(userInfo.id) === String(readingSession.humanBook?.id);
  const isFinished = !!readingSession
    && (readingSession.sessionStatus === StatusEnum.Finished
      || readingSession.sessionStatus?.toLowerCase() === StatusEnum.Finished);
  const hasSubmittedFeedback = !!readingSession?.feedbackSubmittedAt;
  const showFeedback = !!readingSession
    && isViewerLiber
    && !isHuber
    && (!hasSubmittedFeedback || isFeedbackDoneInVisit)
    && (isFeedbackOpen || isFinished);

  // [831] diagnostics: everything the auto-end timer needs, straight from the API.
  // Filter the console by `831` to trace the whole end-of-session chain.
  useEffect(() => {
    console.log('[831] reading session query', {
      hasSession: !!readingSession,
      isLoading: isSessionLoading,
      error: sessionError,
      hasEffectiveEndedAt: !!effectiveEndedAt,
    });
    if (!readingSession) {
      return;
    }
    console.log('[831] API session timing', {
      id: readingSession.id,
      sessionStatus: readingSession.sessionStatus,
      startedAt: readingSession.startedAt,
      endedAt: readingSession.endedAt,
      startTime: readingSession.startTime,
      endTime: readingSession.endTime,
      effectiveEndedAt,
    });
    if (!effectiveEndedAt) {
      console.warn('[831] NO usable endedAt → MeetingShell auto-end will NOT arm');
    }
  }, [readingSession, isSessionLoading, sessionError, effectiveEndedAt]);

  // Block Agora for sessions that are already finished/canceled/missed/rejected.
  // Also the third end-of-session trigger: when the BE auto-end (job/sweep)
  // flips the status, the poll below refetches and this redirect kicks the
  // user out even if the local timer and the call-ended socket were missed.
  useEffect(() => {
    if (!readingSession) {
      return;
    }
    if (isTerminalSessionStatus(readingSession.sessionStatus)) {
      // The Liber still owes feedback: keep them on the page so the popup can
      // collect it instead of bouncing them to notifications.
      if (isFinished && showFeedback) {
        console.log('[842] session finished → holding for feedback');
        return;
      }
      console.log(
        '[831] session is terminal → redirect',
        readingSession.sessionStatus,
      );
      router.replace(isFinished ? '/notifications' : '/my-schedule');
    }
  }, [readingSession, router, isFinished, showFeedback]);

  // Poll the session so a BE-side auto-end is noticed within ≤30s even when
  // the local endedAt timer and the call-ended socket event both missed.
  useEffect(() => {
    if (!sessionId) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      console.log('[831] polling session status (every 30s)');
      void refetchReadingSession();
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [sessionId, refetchReadingSession]);

  const handleEndCall = async () => {
    if (!sessionId) {
      router.push('/notifications');
      return;
    }

    console.log('[831] POST /reading-sessions/:id/end', { sessionId });
    try {
      await endReadingSession({ id: sessionId }).unwrap();
      console.log('[831] POST /end ok → session FINISHED on BE');
      pushSuccess(t('session_finished'));

      if (isViewerLiber) {
        console.log('[842] Liber ended call → open feedback popup');
        setIsFeedbackOpen(true);
        void refetchReadingSession();
        return;
      }
    } catch (err) {
      // Backend is idempotent; a race where the peer already finished still
      // counts as success for leaving the room.
      console.warn('[831] POST /end FAILED', err);
      pushError(t('session_finish_failed'));
    }

    router.push('/notifications');
    console.log('[831] navigate → /notifications');
  };

  const handleSubmitFeedback = async (payload: ReadingSessionFeedbackPayload) => {
    if (!sessionId) {
      return false;
    }

    try {
      await submitReadingSessionFeedback({ id: sessionId, ...payload }).unwrap();
      console.log('[842] feedback submitted');
      setIsFeedbackDoneInVisit(true);
      return true;
    } catch (err) {
      console.warn('[842] feedback submit FAILED', err);
      return false;
    }
  };

  const handleCloseFeedback = () => {
    router.push('/');
  };

  // Wait for the user and session so AgoraMeeting never mounts (and joins the channel) before the survey decision
  if (!readingSession || !userInfo.id) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isTerminalSessionStatus(readingSession.sessionStatus) && !showFeedback) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  const hasSavedSurvey = localStorage.getItem(`is_done_survey_for_reading_${readingSession.id}`) === 'true';
  const needsSurvey = !isHuber && !hasSavedSurvey && !isDoneSurveyForReading;

  return (
    <div className="flex size-full items-center justify-center">
      {!showFeedback && (
        needsSurvey ? (
          <PreSurvey
            sessionId={Number.parseInt(sessionId || '0', 10)}
            onFinish={() => setIsDoneSurveyForReading(true)}
          />
        ) : (
          <MeetingShell
            channel={channel || ''}
            token={token}
            sessionId={sessionId}
            endedAt={effectiveEndedAt}
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
        )
      )}

      <PostMeetingFeedbackModal
        open={showFeedback}
        session={readingSession}
        onCancel={handleCloseFeedback}
        onHome={handleCloseFeedback}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
}
