'use client';

import { ArrowLeft, CalendarDot, User } from '@phosphor-icons/react';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEmpty } from 'lodash';
import Image from 'next/image';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/common/chip/Chip';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { Spinner } from '@/components/common/Spinner';
import { EmojiRateScale } from '@/components/EmojiRateScale';
import IconButton from '@/components/core/iconButton/IconButton';
import Label from '@/components/Label';
import { mergeClassnames } from '@/components/core/private/utils';
import { Rating } from '@/components/Rating';
import TextArea from '@/components/core/textArea/TextArea';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';
import { useDeviceType } from '@/libs/hooks';
import {
  useGetReadingSessionByIdQuery,
  useUpdateReadingSessionMutation,
} from '@/libs/services/modules/reading-session';
import { ROLE_NAME, Role, StatusEnum } from '@/types/common';
import { toLocaleDateString } from '@/utils/dateUtils';
import { PostSurveyValidation } from '@/validations/SurveyValidation';

export default function PostSurvey() {
  const router = useRouter();
  const { id } = useParams();

  const locale = useLocale();
  const t = useTranslations('feedback_form');

  const { data: readingSession } = useGetReadingSessionByIdQuery(Number(id), {
    skip: !id,
  });
  const [updateReadingSession, { isLoading }] = useUpdateReadingSessionMutation();

  const { control, register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(PostSurveyValidation),
    defaultValues: {
      sessionRating: 2,
      feelingRating: 2,
      storyFeedback: {
        rating: 1,
        content: '',
      },
      huberFeedback: {
        rating: 0,
        content: '',
      },
    },
  });

  const [step, setStep] = useState<'feedback-session' | 'feedback-huber' | 'feedback-success'>(
    'feedback-session',
  );
  const [huberFeedback, setHuberFeedback] = useState({
    rating: 0,
    content: '',
  });

  const { deviceType } = useDeviceType();
  const isMobileView = deviceType === 'mobile';

  const handleNextStep = async () => {
    if (!!errors.sessionRating || !!errors.feelingRating || !!errors.storyFeedback) {
      return;
    }

    const { sessionRating, feelingRating, storyFeedback } = watch();

    try {
      await updateReadingSession({
        id,
        sessionRating: {
          rating: Math.round((sessionRating + feelingRating) / 2),
        },
        storyReview: storyFeedback,
      }).unwrap();
      pushSuccess('Sent feedback successfully');
    } catch (error) {
      pushError('Sent feedback failed');
    } finally {
      setStep('feedback-huber');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirm = async () => {
    if (huberFeedback.rating === 0 || huberFeedback.content === '') {
      return;
    }
    try {
      await updateReadingSession({
        id,
        huberFeedback,
      }).unwrap();
      pushSuccess('Sent feedback successfully');
    } catch (error) {
      pushError('Sent feedback failed');
    } finally {
      setStep('feedback-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!readingSession) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (readingSession?.status !== StatusEnum.Finished) {
    redirect('/my-schedule');
  }

  return (
    <div className="flex size-full items-center justify-center p-0 pb-6 xl:p-6">
      <div className={mergeClassnames(
        'flex w-full rounded-none flex-col items-center xl:rounded-[20px]',
        step === 'feedback-success'
          ? 'gap-4 bg-gradient-to-b from-pink-90 to-white p-8 xl:max-w-md'
          : 'max-w-xl p-4 pt-0 gap-6 bg-white xl:p-5 xl:gap-8',
      )}
      >
        {step === 'feedback-session' && (
          <>
            <div className="-mb-6 w-full xl:hidden">
              <IconButton variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft />
              </IconButton>
            </div>
            <h4 className="text-center text-xl font-medium leading-7 text-black xl:text-2xl">
              {t('session_feedback')}
            </h4>
            <div className="flex w-full flex-col gap-2">
              <ScheduleInfoItemLayout
                icon={<CalendarDot className="text-primary-60" />}
                title={`${toLocaleDateString(readingSession?.startedAt, locale === 'en' ? 'en-GB' : 'vi-VI')} | ${readingSession?.startTime} - ${readingSession?.endTime}`}
              />
              <SessionAttendees
                huber={readingSession?.humanBook}
                liber={readingSession?.reader}
                isVibing
                icon={<User className="text-primary-60" />}
                childClassname="pl-4"
              />
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-center font-medium leading-5 text-neutral-10">
                {t('how_do_you_feel')}
              </p>
              <Controller
                name="feelingRating"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <EmojiRateScale
                    value={value}
                    onChange={val => onChange(val)}
                    lowestRateText={t('not_good')}
                    highestRateText={t('very_good')}
                  />
                )}
              />
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-center font-medium leading-5 text-neutral-10">
                {t('did_session_satisfy')}
              </p>
              <Controller
                name="sessionRating"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <EmojiRateScale
                    value={value}
                    onChange={val => onChange(val)}
                    lowestRateText={t('not_satisfied')}
                    highestRateText={t('very_satisfied')}
                  />
                )}
              />
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-center font-medium leading-5 text-neutral-10">
                {t('rate_for_story')}
                {' “'}
                <span className="break-words text-primary-60">{readingSession?.story?.title || 'Unnamed'}</span>
                ”
              </p>
              <Controller
                name="storyFeedback.rating"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Rating
                    value={value}
                    onChange={val => onChange(val)}
                  />
                )}
              />
            </div>
            <TextArea
              placeholder={t('share_thought')}
              rows={5}
              {...register('storyFeedback.content')}
            />
            <div className="flex w-full gap-3">
              <Button
                fullWidth
                size="lg"
                variant="outline"
                className="hidden xl:flex"
                onClick={() => router.back()}
              >
                {t('cancel')}
              </Button>
              <Button
                fullWidth
                size={isMobileView ? 'sm' : 'lg'}
                disabled={!isEmpty(errors) || isLoading}
                animation={isLoading && 'progress'}
                onClick={handleNextStep}
              >
                {t('next')}
              </Button>
            </div>
          </>
        )}
        {step === 'feedback-huber' && (
          <>
            <div className="-mb-6 w-full xl:hidden">
              <IconButton variant="ghost" size="sm" onClick={() => setStep('feedback-session')}>
                <ArrowLeft />
              </IconButton>
            </div>
            <h4 className="text-center text-xl font-medium text-black xl:text-2xl">
              {t('feedback_for_huber')}
            </h4>
            <div className="flex items-center gap-1">
              <Avatar size="sm" imageUrl={readingSession?.humanBook?.photo?.path} />
              <Chip disabled className="rounded-[100px] bg-primary-90 text-primary-50 opacity-100">
                {ROLE_NAME[Role.HUBER]}
              </Chip>
              <h6 className="text-xl font-medium text-neutral-10">
                {readingSession?.humanBook?.fullName || 'Unknown'}
              </h6>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-center font-medium leading-5 text-neutral-10">
                {t('how_many_love')}
              </p>
              <Rating
                value={huberFeedback.rating}
                onChange={val => setHuberFeedback({ ...huberFeedback, rating: val })}
                activeColor="pink-50"
              />
            </div>

            <div className="flex w-full flex-col gap-4">
              <Label>{t('say_something')}</Label>
              <TextArea
                placeholder={t('write_something')}
                rows={5}
                value={huberFeedback.content}
                onChange={e => setHuberFeedback({ ...huberFeedback, content: e.target.value })}
              />
            </div>

            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                fullWidth
                size={isMobileView ? 'sm' : 'lg'}
                onClick={() => router.push('/home')}
              >
                {t('skip')}
              </Button>
              <Button
                fullWidth
                size={isMobileView ? 'sm' : 'lg'}
                disabled={huberFeedback.rating === 0 || huberFeedback.content === ''}
                animation={isLoading && 'progress'}
                onClick={handleConfirm}
              >
                {t('confirm')}
              </Button>
            </div>
          </>
        )}
        {step === 'feedback-success' && (
          <>
            <Image
              src="/assets/images/Hulib Webapp.png"
              alt="Successful Feedback"
              width={isMobileView ? 256 : 366}
              height={isMobileView ? 331 : 445}
              className="h-[445px] w-[366pc] object-cover"
            />
            <h4 className="text-center text-xl leading-9 text-green-50 xl:text-[28px] xl:font-medium">
              {t('thank_you')}
            </h4>
            <p className="mx-auto w-5/6 text-center text-sm text-neutral-30">{t('feedback_value')}</p>
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                size={isMobileView ? 'sm' : 'lg'}
                fullWidth
                onClick={() => router.push('/my-schedule')}
              >
                {t('go_to_schedule')}
              </Button>
              <Button
                fullWidth
                size={isMobileView ? 'sm' : 'lg'}
                onClick={() => router.push('/home')}
              >
                {t('back_to_home')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
