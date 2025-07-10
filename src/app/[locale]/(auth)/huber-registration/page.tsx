'use client';

import { Check } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import { SuccessScreen } from '@/components/common/SuccessScreen';
import Step1 from '@/components/huber-registration/Step1';
import Step2 from '@/components/huber-registration/Step2';
import Step3 from '@/components/huber-registration/Step3';
import CommonLayout from '@/layouts/CommonLayout';
import { useAppSelector } from '@/libs/hooks';

interface Step {
  no: string;
  value: string;
  num: number;
}

const STEPS: Step[] = [
  { no: '01', value: 'Info', num: 1 },
  { no: '02', value: 'Choose Available slot', num: 2 },
  { no: '03', value: 'First Story', num: 3 },
];

const ProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div
    className={clsx(
      'relative mb-4 flex  w-full items-center justify-between px-0',
      ' md:px-8 ',
    )}
  >
    <div
      className={clsx(
        'absolute inset-x-0 top-4 z-0  flex w-full items-center justify-center p-0',
        'md:pl-[4.125rem] md:pr-[5rem] ',
      )}
    >
      <div
        className={`h-0.5 w-1/2 
          ${currentStep > 1 ? 'bg-primary-50' : 'bg-neutral-80'}`}
      />
      <div
        className={`h-0.5 w-1/2 
          ${currentStep > 2 ? 'bg-primary-50' : 'bg-neutral-80'}`}
      />
    </div>
    {STEPS.map((item) => (
      <div
        key={item.no}
        className="flex flex-col items-center justify-center gap-2.5 text-[13px]"
      >
        <div
          className={clsx(
            'relative z-10 flex size-8 items-center justify-center rounded-full font-medium',
            currentStep > item.num
              ? 'bg-primary-50'
              : 'border-[2px] border-solid bg-white',
            currentStep === item.num
              ? 'border-primary-50'
              : 'border-neutral-80',
            currentStep === item.num ? 'text-primary-50' : 'text-neutral-80',
          )}
        >
          <span className="mt-1">
            {item.num < currentStep ? (
              <Check color="white" size={16} />
            ) : (
              item.no
            )}
          </span>
        </div>
        <div
          className={`text-sm ${
            item.num <= currentStep
              ? 'font-bold text-primary-50 '
              : 'font-medium text-neutral-80'
          }`}
        >
          {item.value}
        </div>
      </div>
    ))}
  </div>
);

const StepContent = ({
  currentStep,
  onNext,
  t,
}: {
  currentStep: number;
  onNext: () => void;
  t: ReturnType<typeof useTranslations>;
}) => {
  switch (currentStep) {
    case 1:
      return <Step1 next={onNext} />;
    case 2:
      return <Step2 next={onNext} />;
    case 3:
      return <Step3 next={onNext} />;
    case 4:
      return (
        <SuccessScreen
          title={t('title_notification')}
          notification={t('notification')}
          nameButton={t('btn_name_notification')}
          linkButton="/explore-story"
        />
      );
    default:
      return null;
  }
};

const Page = () => {
  const t = useTranslations('Common');
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [currentStep, setCurrentStep] = React.useState(1);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      const savedStep = localStorage.getItem(
        `${userInfo.id}_huber_registration_step`,
      );
      if (savedStep) {
        setCurrentStep(Number(savedStep));
      }
    }
  }, [userInfo]);

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
    localStorage.setItem(
      `${userInfo.id}_huber_registration_step`,
      (currentStep + 1).toString(),
    );
  };

  return (
    <CommonLayout
      className={clsx(
        'flex w-full !flex-col justify-center !bg-neutral-98',
        currentStep !== 3 && 'items-center',
      )}
    >
      <div className={clsx('w-full', 'md:w-[37.5rem]')}>
        <ProgressBar currentStep={currentStep} />
      </div>
      <div
        className={clsx(
          currentStep !== 3 ? clsx('w-full', 'md:w-[37.5rem]') : 'w-full',
        )}
      >
        <StepContent currentStep={currentStep} onNext={handleNextStep} t={t} />
      </div>
    </CommonLayout>
  );
};

export default Page;
