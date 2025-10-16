'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { differenceInMinutes } from 'date-fns';

import { useAppSelector } from '@/libs/hooks';
import {
  useGetReadingSessionByIdQuery,
  useUpdateReadingSessionMutation,
} from '@/libs/services/modules/reading-session';
import PreSurvey from '@/layouts/reading/PreSurvey';
import { Spinner } from '@/components/loadingState/Spinner';
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
        pushSuccess('Session has finished successfully');
      } catch (error) {
        pushError('Failed to stop recording!');
      }
    }

    try {
      await updateReadingSession({
        id: sessionId,
        sessionStat: StatusEnum.Finished,
      }).unwrap();
      pushSuccess('Session has finished successfully');
    } catch (error) {
      pushError('Failed to finish session');
    } finally {
      router.push('/notifications');
    }
  };

  if (!readingSession) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex size-full items-center justify-center">
      {!isDoneSurveyForReading && showPreSurvey ? (
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
