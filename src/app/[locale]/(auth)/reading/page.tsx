'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import { useTranslations } from 'next-intl';

import { useAppSelector } from '@/libs/hooks';
import { useRouter } from '@/libs/i18nNavigation';
import {
  useGetReadingSessionByIdQuery,
  useUpdateReadingSessionMutation,
} from '@/libs/services/modules/reading-session';
import PreSurvey from '@/layouts/reading/PreSurvey';
import Loading from '@/app/[locale]/loading';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { StatusEnum } from '@/types/common';
import { useStopCloudRecordingMutation } from '@/libs/services/modules/agora';
import { readAgoraToken } from '@/features/meeting/utils/agoraToken';

// The meeting room touches `window` and the Agora SDK on mount, so it must not
// be server-rendered.
const MeetingShell = dynamic(
  () => import('@/features/meeting/components/MeetingShell').then(mod => mod.MeetingShell),
  {
    ssr: false,
  },
);

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
  const [stopRecording] = useStopCloudRecordingMutation();
  const [updateReadingSession] = useUpdateReadingSessionMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [isDoneSurveyForReading, setIsDoneSurveyForReading] = useState(false);
  const [showPreSurvey, setShowPreSurvey] = useState(false);

  useEffect(() => {
    if (!userInfo.id || !readingSession) {
      return;
    }
    const savedIsDoneSurveyForReading = localStorage.getItem(
      `is_done_survey_for_reading_${readingSession.id}`,
    );
    const isHuber = userInfo?.id === readingSession.humanBook.id;
    if (isHuber || savedIsDoneSurveyForReading) {
      setIsDoneSurveyForReading(true);
    }

    const meetingStart = new Date(readingSession.startedAt); // meetingTime in ISO format or valid date string
    const now = new Date();

    const diff = differenceInMinutes(meetingStart, now);

    if (diff <= 5) {
      setShowPreSurvey(true);
    }
  }, [userInfo.id, readingSession]);

  const handleEndCall = async (recordedInfo?: { resourceId: string; sid: string; uid: string }) => {
    const meetingEnd = new Date(readingSession.endedAt);
    const now = new Date();

    const diff = differenceInMinutes(now, meetingEnd);

    if (diff < 0) {
      return router.push('/my-schedule');
    }

    if (recordedInfo?.resourceId && recordedInfo.sid && recordedInfo.uid) {
      try {
        await stopRecording({
          channel,
          ...recordedInfo,
        }).unwrap();
        pushSuccess(t('session_finished'));
      } catch {
        pushError(t('recording_stop_failed'));
      }
    }

    try {
      await updateReadingSession({
        id: sessionId,
        sessionStat: StatusEnum.Finished,
      }).unwrap();
      pushSuccess(t('session_finished'));
    } catch {
      pushError(t('session_finish_failed'));
    } finally {
      router.push('/notifications');
    }
  };

  if (!readingSession) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Loading />
      </div>
    );
  }

  const isViewerLiber = Number(userInfo.id) === Number(readingSession.reader?.id);

  return (
    <div className="flex size-full items-center justify-center">
      {!isDoneSurveyForReading && showPreSurvey ? (
        <PreSurvey
          sessionId={Number.parseInt(sessionId || '0', 10)}
          onFinish={() => setIsDoneSurveyForReading(true)}
        />
      ) : (
        <MeetingShell
          channel={channel || ''}
          token={token}
          sessionId={sessionId}
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
