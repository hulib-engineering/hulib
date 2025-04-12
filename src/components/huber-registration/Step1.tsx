'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import TermAndCondition from '@/components/huber-registration/TermAndCondition';
import { useRegisterHuberMutation } from '@/libs/services/modules/auth';
import { HuberStep1Validation } from '@/validations/HuberValidation';

interface Props {
  next: any;
}

type FormData = z.infer<ReturnType<typeof HuberStep1Validation>>;

const Step1 = (props: Props) => {
  const { next } = props;
  const t = useTranslations('HumanBookRegister');
  const router = useRouter();
  const [registerHuber, { isLoading }] = useRegisterHuberMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(HuberStep1Validation(t)),
    mode: 'onChange',
    defaultValues: {
      bio: '',
      videoUrl: '',
      isConfirmed: false,
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0] as keyof FormData;
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [errors]);

  const onSubmit = async (formData: FormData) => {
    try {
      const res = await registerHuber(formData);

      if (res?.error?.status === 422) {
        pushError('An error occurred, please contact admin for support!');
      } else {
        localStorage.setItem('huber_registration_step', '2');
        pushSuccess('Registration successful!');
        next();
      }
    } catch (error: any) {
      pushError(error?.message || '');
    }
  };

  const getInputClassName = (fieldName: keyof FormData) => {
    const baseClass =
      'rounded-lg border border-solid p-3 text-sm leading-4 text-neutral-40 outline-none';
    const errorClass = errors[fieldName]
      ? 'border-red-500'
      : 'border-neutral-90';
    const disabledClass = isLoading ? 'opacity-50 cursor-not-allowed' : '';
    return `${baseClass} ${errorClass} ${disabledClass}`;
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <form
      id="step-1"
      className="flex flex-col items-center justify-center rounded-3xl bg-white p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="self-start text-xl font-medium leading-[2.75rem] text-neutral-10 md:text-[2.25rem]">
        {t('step_1_title')}
      </p>
      <label className="mt-6 flex w-full flex-col gap-2" htmlFor="bio">
        <span className="text-sm leading-4 text-neutral-10">
          {t('bio.text')} <span className="text-red-50">*</span>
        </span>
        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <textarea
                id="bio"
                placeholder={t('bio.placeholder')}
                className={`h-[8.5rem] resize-none bg-neutral-98 ${getInputClassName(
                  'bio',
                )}`}
                disabled={isFormDisabled}
                {...field}
              />
              {error && (
                <span className="text-sm text-red-500">{error.message}</span>
              )}
            </>
          )}
        />
      </label>

      <label className="mt-6 flex w-full flex-col gap-2" htmlFor="videoUrl">
        <span className="text-sm leading-4 text-neutral-10">
          {t('intro_video.text')} <span className="text-red-50">*</span>
        </span>
        <Controller
          name="videoUrl"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                id="videoUrl"
                placeholder={t('intro_video.placeholder')}
                className={`h-10 bg-neutral-98 ${getInputClassName(
                  'videoUrl',
                )}`}
                disabled={isFormDisabled}
                {...field}
              />
              {error && (
                <span className="text-sm text-red-500">
                  {error.type === 'url'
                    ? t('validation.invalid_url')
                    : error.message}
                </span>
              )}
            </>
          )}
        />
      </label>

      <div className="mt-6 flex w-full flex-col gap-2 rounded-lg bg-neutral-98 p-5">
        <span className="text-sm leading-4 text-neutral-10">
          {`${t('read_community')} `}
          <span className="text-red-50">*</span>
        </span>
        <div className="rounded-xl bg-neutral-90 p-4">
          <span className="text-sm uppercase leading-5 text-primary-40">
            {t('general')}
          </span>
          <TermAndCondition />
        </div>
        <Controller
          name="isConfirmed"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <div
                className={`mt-3 flex flex-row items-start gap-2 ${
                  errors.isConfirmed ? 'rounded-lg border border-red-500' : ''
                }`}
              >
                <input
                  id="isConfirmed"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 border border-solid border-neutral-40"
                  disabled={isFormDisabled}
                />
                <span className="text-xs leading-5 text-neutral-10">
                  {t('confirm')}
                </span>
              </div>
              {error && (
                <span className="text-sm text-red-500">{error.message}</span>
              )}
            </>
          )}
        />
      </div>
      <div className="flex w-full items-center gap-3">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => router.push('/')}
          disabled={isFormDisabled}
        >
          {t('cancel')}
        </Button>
        <Button
          className="w-full"
          type="submit"
          animation={isFormDisabled ? 'progress' : undefined}
          disabled={isFormDisabled}
        >
          {t('next')}
        </Button>
      </div>
    </form>
  );
};

export default Step1;
