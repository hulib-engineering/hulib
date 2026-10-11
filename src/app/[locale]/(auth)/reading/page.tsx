'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { differenceInMinutes } from 'date-fns';

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

const AgoraMeeting = dynamic(
  () => import('@/layouts/reading/AgoraMeeting'),
  {
    ssr: false,
  },
);

export default function ReadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel');
  const sessionId = channel?.split('-')?.[1];

  const { data: readingSession } = useGetReadingSessionByIdQuery(sessionId || 0, {
    skip: !sessionId,
  });
  const [stopRecording] = useStopCloudRecordingMutation();
  const [updateReadingSession] = useUpdateReadingSessionMutation();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  // Set when the survey is skipped or finished in this visit; a successful submit also writes the localStorage flag
  const [isDoneSurveyForReading, setIsDoneSurveyForReading] = useState(false);

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
        pushSuccess('Session has finished successfully');
      } catch {
        pushError('Failed to stop recording!');
      }
    }

    try {
      await updateReadingSession({
        id: sessionId,
        sessionStat: StatusEnum.Finished,
      }).unwrap();
      pushSuccess('Session has finished successfully');
    } catch {
      pushError('Failed to finish session');
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
        <AgoraMeeting onEndCall={handleEndCall} />
      )}
    </div>
  );
}
