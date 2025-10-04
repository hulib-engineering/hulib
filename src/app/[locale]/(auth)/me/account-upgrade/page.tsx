'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { redirect, useRouter } from 'next/navigation';

import Button from '@/components/core/button/Button';
import { Step, StepLabel, Stepper } from '@/components/core/stepper/Stepper';
import { mergeClassnames } from '@/components/core/private/utils';
import Step1 from '@/layouts/profile/Step1';
import Step2 from '@/layouts/profile/Step2';
import { useAppSelector } from '@/libs/hooks';
import { Role, StatusEnum } from '@/types/common';
import StoryForm from '@/layouts/stories/StoryForm';

const STEPS = ['Info', 'Choose Available slot', 'First Story'];

export default function AccountUpgrade() {
  const router = useRouter();

  const t = useTranslations('Common');

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (userInfo && userInfo?.approvalStatus === StatusEnum.Pending) {
      setActiveStep(3);
    }
    if (userInfo && userInfo?.role?.id === Role.HUBER) {
      redirect(`/users/${userInfo.id}`);
    }
  }, [userInfo]);

  const handleNextStep = () => setActiveStep(prev => prev + 1);

  return (
    <div
      className={mergeClassnames(
        'mx-auto my-8 flex flex-col gap-6 xl:gap-8',
        activeStep === 2 ? 'max-w-7xl' : 'max-w-2xl items-center',
      )}
    >
      <Stepper
        activeStep={activeStep}
        className={mergeClassnames(
          'px-8',
          activeStep === 3 ? 'max-w-md' : 'max-w-2xl',
          activeStep === 0 ? 'xl:px-3' : 'xl:px-0',
        )}
      >
        {STEPS.map((label, index) => (
          <Step key={index} index={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className={mergeClassnames('w-full mx-auto', activeStep === 2 ? 'md:max-w-7xl' : 'md:max-w-2xl')}>
        {activeStep === 0 && (
          <Step1 next={handleNextStep} />
        )}
        {activeStep === 1 && (
          <Step2 next={handleNextStep} onBack={() => setActiveStep(prev => prev - 1)} />
        )}
        {activeStep === 2 && (
          <StoryForm
            type="create-first"
            onSucceed={handleNextStep}
            onBack={() => setActiveStep(prev => prev - 1)}
          />
        )}
        {activeStep === 3 && (
          <div className="flex w-full flex-col items-center gap-4 rounded-[20px] bg-white p-4 shadow-sm">
            <Image
              src="/assets/images/schedule-success.svg"
              alt="success"
              width={434}
              height={374}
              className="h-[374px] w-full md:h-[320px] md:w-[372px]"
            />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-5">
                <h5 className="text-2xl font-medium">{t('title_notification')}</h5>
                <p className="text-center text-sm text-black/80">{t('notification')}</p>
              </div>
              <div className="grid grid-cols-2 items-center justify-center gap-x-2 md:gap-x-3">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/explore-story')}
                >
                  {t('btn_name_notification')}
                </Button>
                <Button size="lg" fullWidth onClick={() => router.push('/explore-story')}>
                  {t('back_to_home')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
