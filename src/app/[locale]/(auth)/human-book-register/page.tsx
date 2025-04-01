'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import { FormSkeletonLoading } from '@/components/human-book-register/FormSkeletonLoading';
import Popup from '@/components/human-book-register/Popup';
import Step1 from '@/components/human-book-register/Step1';
import Step2 from '@/components/human-book-register/Step2';
import StepCircle from '@/components/human-book-register/StepCircle';
import { mergeClassnames } from '@/components/private/utils';
import { useRegisterHumanBookMutation } from '@/libs/services/modules/auth';
import { HumanBookValidation } from '@/validations/HumanBookValidation';
// import checkRegisterHumanBook from '@/libs/services/modules/auth/checkRegisterHumanBook';

const defaultValues = {
  about: '',
  section: [],
  education: '',
  from: 2024,
  to: 2024,
};

const Index = () => {
  const t = useTranslations('HumanBookRegister');
  const [currentStep, setCurrentStep] = React.useState(2);
  const [successModal, setSuccessModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [urlError, setURLError] = React.useState(false);
  const tempUrl = useRef<string>('');
  const validationSchema = HumanBookValidation(t);
  const router = useRouter();
  const methods = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });
  const [registerHumanBook, { isLoading }] = useRegisterHumanBookMutation();

  const isValid = React.useCallback(
    (data: z.infer<typeof validationSchema>) => {
      const { about, education, from, to, section } = data;

      if (
        about.length === 0 ||
        education.length === 0 ||
        section.length === 0
      ) {
        return false;
      }

      if (from > to) {
        return false;
      }
      return true;
    },
    [],
  );

  const onNextPress = React.useCallback(
    (data: z.infer<typeof validationSchema>) => {
      try {
        if (isValid(data)) {
          setCurrentStep(1);
        }
      } catch (error: any) {
        pushError('Error at human-book-register.ts: onNextPress');
      }
    },
    [isValid],
  );

  const onRegisterPress = React.useCallback((url: string) => {
    if (url.length === 0) {
      setURLError(true);
    } else {
      tempUrl.current = url;
      setURLError(false);
      setConfirmModal(true);
    }
  }, []);

  const onGoBackPress = React.useCallback(() => {
    setCurrentStep(0);
    setURLError(false);
  }, []);

  const renderCurrentStepSection = React.useCallback(() => {
    switch (currentStep) {
      case 0:
        return <Step1 methods={methods} onNextPress={onNextPress} />;
      case 1:
        return (
          <Step2
            onGoBackPress={onGoBackPress}
            onRegisterPress={onRegisterPress}
            urlError={urlError}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    methods,
    urlError,
    onNextPress,
    onGoBackPress,
    onRegisterPress,
  ]);

  const handleBackToHome = () => {
    router.push('/');
    router.refresh();
  };

  const formatDateWithSelectedYear = (year: number) => {
    const currentDate = new Date();
    currentDate.setFullYear(year);

    return currentDate.toISOString();
  };

  const onSubmitPress = async () => {
    const data = methods.getValues();
    const form = {
      bio: data?.about,
      videoUrl: tempUrl.current,
      education: data?.education,
      topics: data?.section,
      educationStart: formatDateWithSelectedYear(data?.from),
      educationEnd: formatDateWithSelectedYear(data?.to),
    };

    try {
      await registerHumanBook(form);
      setTimeout(() => {
        setSuccessModal(true);
      }, 200);
    } catch (error) {
      pushError('Register Human Book fail!!!');
    }
    setConfirmModal(false);
  };

  if (isLoading) return <FormSkeletonLoading />;

  return (
    <div
      className={mergeClassnames(
        `flex min-h-screen flex-col items-center justify-center bg-neutral-98 pb-4 ${
          currentStep === 0 ? 'mt-[-5rem]' : 'mt-[-10rem]'
        }`,
      )}
    >
      <div
        className={mergeClassnames(
          'flex flex-col gap-8 pt-[3.25rem] w-screen relative',
          'sm:w-[600px] sm:min-w-[600px] sm:gap-12',
        )}
      >
        <div className="flex flex-row items-center justify-between px-10">
          <StepCircle
            value={0}
            active={currentStep === 0}
            isDoneStep={currentStep === 1}
          />
          <div
            className={`h-[1px] w-[424px] border-[1px] border-primary-80 ${
              currentStep === 0 ? 'border-dashed' : 'border-solid'
            }`}
          />
          <StepCircle value={1} active={currentStep === 1} />
        </div>
        <div className={mergeClassnames('rounded-lg bg-white p-4', 'sm:p-5')}>
          <p
            className={mergeClassnames(
              'mb-5 text-2xl font-medium leading-[44px] text-black',
              'sm:text-4xl sm:mb-10',
            )}
          >
            {t('register_as_a_human_book')}
          </p>
          {renderCurrentStepSection()}
        </div>
      </div>
      <Popup
        onClose={handleBackToHome}
        open={successModal}
        description={t('success_submit_form_description')}
        title={t('success_submit_form_header')}
        actions={
          <Button onClick={handleBackToHome}>{t('back_to_home')}</Button>
        }
      />

      <Popup
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
        description={t('register_as_a_human_book')}
        title={t('register_confirm_message')}
        actions={
          <div className="flex flex-row gap-3">
            <Button onClick={() => setConfirmModal(false)} variant="outline">
              {t('Back')}
            </Button>
            <Button
              onClick={onSubmitPress}
              disabled={isLoading}
              animation={isLoading && 'progress'}
            >
              {t('Submit')}
            </Button>
          </div>
        }
      />
    </div>
  );

  // if (isRegisterHumanBook) {
  //   return (
  //     <p className="flex items-center justify-center text-center text-sm">
  //       {t('humanBookRegistered')}
  //     </p>
  //   );
  // }
};

export default Index;
