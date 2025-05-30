'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Loader from '@/components/loader/Loader';
import RatingScale from '@/components/meeting/RatingScale';
import { useAppSelector } from '@/libs/hooks';
import {
  useGetReadingSessionByIdQuery,
  useUpdateReadingSessionMutation,
} from '@/libs/services/modules/reading-session';

// Dynamic import để dùng component client
const AgoraVideoCall = dynamic(
  () => import('@/components/meeting/AgoraVideoCall'),
  {
    ssr: false,
  },
);

export default function ReadingPage() {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel');
  const sessionId = channel?.split('-')?.[1];
  const [updateReadingSession, { isLoading }] =
    useUpdateReadingSessionMutation();
  const [isDoneSurveyForReading, setIsDoneSurveyForReading] = useState(false);
  const [surveyData, setSurveyData] = useState({
    feeling: 0,
    story: 0,
    huber: 0,
    session: 0,
  });
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
  const { data: readingSession } = useGetReadingSessionByIdQuery(
    {
      id: sessionId || 0,
    },
    {
      skip: !sessionId,
    },
  );

  useEffect(() => {
    if (!userInfo?.id || !readingSession) return;
    const savedIsDoneSurveyForReading = localStorage.getItem(
      `is_done_survey_for_reading_${userInfo.id}_${readingSession.id}`,
    );
    const isHuber = userInfo?.id === readingSession.humanBook.id;
    if (isHuber || savedIsDoneSurveyForReading) {
      setIsDoneSurveyForReading(true);
    }
  }, [userInfo?.id, readingSession]);

  // Handle survey submission
  const handleSurveySubmit = async () => {
    try {
      // Update reading session with presurvey data if sessionId exists
      if (sessionId) {
        const presurveyData = [
          {
            id: 1,
            rating: surveyData.feeling,
          },
          {
            id: 2,
            rating: surveyData.story,
          },
          {
            id: 3,
            rating: surveyData.huber,
          },
          {
            id: 4,
            rating: surveyData.session,
          },
        ];

        await updateReadingSession({
          id: parseInt(sessionId, 10),
          presurvey: presurveyData,
        }).unwrap();

        // Save survey completion status to localStorage
        localStorage.setItem(
          `is_done_survey_for_reading_${userInfo.id}_${readingSession.id}`,
          'true',
        );

        pushSuccess('Survey data saved successfully!');
      }

      // Update state to show video call
      setIsDoneSurveyForReading(true);
    } catch (error) {
      pushError('Failed to save survey data. Please try again.');

      // Still show video call even if API call fails
      setIsDoneSurveyForReading(true);
    }
  };

  // Handle rating selection
  const handleRatingChange = (question: string, rating: number) => {
    setSurveyData((prev) => ({
      ...prev,
      [question]: rating,
    }));
  };

  // Check if all questions are answered
  const isFormComplete = Object.values(surveyData).every((value) => value > 0);

  if (!readingSession || isLoading)
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="flex size-full items-center justify-center">
      {isDoneSurveyForReading ? (
        <AgoraVideoCall appId={appId} />
      ) : (
        <div className="m-3 flex size-full items-center justify-center p-2 sm:m-6 sm:p-0">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:p-8">
            {/* Header Section */}
            <div className="mb-4 flex flex-col items-center gap-3 sm:gap-4">
              <div>
                <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
                  We care about your mental well-being
                </h1>
                <div className="mt-3 space-y-2 sm:mt-4">
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                    Before the meeting, we would like to send you a below
                    survey-form to know your overall well-being.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                    The survey takes only 15 seconds but what you input is very
                    valuable to us.
                  </p>
                </div>
              </div>
            </div>

            {/* Survey Form */}
            <div className="space-y-6 sm:space-y-8">
              {/* Question 1: How are you feeling today? */}
              <RatingScale
                question="1. How are you feeling today?"
                leftLabel="Not good"
                rightLabel="Very good"
                value={surveyData.feeling}
                onChange={(rating) => handleRatingChange('feeling', rating)}
              />

              <RatingScale
                question="2. How relevant does the story to your problem?"
                leftLabel="Not relevant"
                rightLabel="Very relevant"
                value={surveyData.story}
                onChange={(rating) => handleRatingChange('story', rating)}
              />

              <RatingScale
                question="3. How relevant does the Huber's profile to your interest?"
                leftLabel="Not relevant"
                rightLabel="Very relevant"
                value={surveyData.huber}
                onChange={(rating) => handleRatingChange('huber', rating)}
              />

              <RatingScale
                question="4. How helpful do you think this session will be for you?"
                leftLabel="Not helpful"
                rightLabel="Very helpful"
                value={surveyData.session}
                onChange={(rating) => handleRatingChange('session', rating)}
              />

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <Button
                  variant="primary"
                  onClick={handleSurveySubmit}
                  disabled={!isFormComplete}
                  className="w-full text-sm sm:text-base"
                >
                  {isFormComplete
                    ? 'Complete Survey & Join Meeting'
                    : 'Please answer all questions'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
