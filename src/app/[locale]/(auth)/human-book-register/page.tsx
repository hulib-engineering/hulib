'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import Popup from '@/components/human-book-register/Popup';
import Step1 from '@/components/human-book-register/Step1';
import Step2 from '@/components/human-book-register/Step2';
import StepCircle from '@/components/human-book-register/StepCircle';
import { mergeClassnames } from '@/components/private/utils';
import {
  useCheckRegisterHumanBookMutation,
  useRegisterHumanBookMutation,
} from '@/libs/services/modules/auth';
import { HumanBookValidation } from '@/validations/HumanBookValidation';

const defaultValues = {
  about: '',
  section: [],
  education: '',
  from: 2024,
  to: 2024,
};

const Index = () => {
  const t = useTranslations('HumanBookRegister');
  const [currentStep, setCurrentStep] = React.useState(0);
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
  const [checkRegisterHumanBook] = useCheckRegisterHumanBookMutation();
  const [isRegisterHumanBookLoading, setIsRegisterHumanbookLoading] =
    React.useState(true);

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

    console.log(form);

    try {
      await registerHumanBook(form);
      setTimeout(() => {
        setSuccessModal(true);
      }, 200);
    } catch (error) {
      console.log(error);
      pushError('Register Human Book fail!!!');
    }
    setConfirmModal(false);
  };

  React.useEffect(() => {
    const checkResponse = async () => {
      try {
        const result = await checkRegisterHumanBook().unwrap();

        if (result) {
          router.push('/');
        }
        setIsRegisterHumanbookLoading(false);
      } catch (error) {
        setIsRegisterHumanbookLoading(false);
      }
    };

    checkResponse();
  }, [checkRegisterHumanBook, router, setIsRegisterHumanbookLoading]);

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
      {isRegisterHumanBookLoading && (
        <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-hidden bg-[rgba(0,0,0,0.5)]">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline h-8 w-8 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      )}
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
};

export default Index;
