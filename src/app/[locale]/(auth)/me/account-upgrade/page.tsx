'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { redirect, useRouter } from 'next/navigation';

import { Spinner } from '@phosphor-icons/react';
import Step1 from './_components/Step1';
import Step2 from './_components/Step2';

import Button from '@/components/core/button/Button';
import { Step, StepLabel, Stepper } from '@/components/core/stepper/Stepper';
import { mergeClassnames } from '@/components/core/private/utils';
import { useAccountUpgradeStep } from '@/features/users/hooks/useAccountUpgradeStep';
import { useAppSelector, useMobile } from '@/libs/hooks';
import { Role, StatusEnum } from '@/types/common';
import StoryForm from '@/features/stories/components/StoryForm';

const STEPS = ['Fill Information', 'Select Available Slots', 'Create Story'];

export default function AccountUpgrade() {
  const router = useRouter();

  const t = useTranslations('Common');

  const isMobile = useMobile();

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const initialCheckDone = useRef(false);

  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    showSuccess,
    setShowSuccess,
  } = useAccountUpgradeStep();

  useEffect(() => {
    if (!userInfo?.id || initialCheckDone.current) {
      return;
    }
    initialCheckDone.current = true;

    if (userInfo.approval === StatusEnum.Pending) {
      setShowSuccess(true);
    } else if (userInfo.role?.id === Role.HUBER) {
      redirect(`/users/${userInfo.id}`);
    }
  }, [userInfo, setShowSuccess]);

  if (!userInfo) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div
      className={mergeClassnames(
        'mx-auto my-8 flex flex-col gap-6 xl:gap-8',
        !showSuccess && currentStep === 2
          ? 'max-w-7xl'
          : 'max-w-2xl items-center',
        showSuccess && 'my-0 md:my-8',
      )}
    >
      <Stepper
        activeStep={showSuccess ? STEPS.length : currentStep}
        className={mergeClassnames(
          'px-8',
          !showSuccess ? 'max-w-2xl' : 'max-w-md',
          !showSuccess && currentStep === 0 ? 'xl:px-3' : 'xl:px-0',
          showSuccess && 'max-md:hidden',
        )}
      >
        {STEPS.map((label, index) => (
          <Step key={label} index={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div
        className={mergeClassnames(
          'w-full mx-auto',
          showSuccess
            ? 'md:max-w-[536px] md:p-4'
            : currentStep === 2
              ? 'md:max-w-7xl'
              : 'md:max-w-2xl',
        )}
      >
        {showSuccess ? (
          <div className="flex w-full flex-col items-center gap-4 rounded-[20px] bg-white p-4 shadow-sm">
            <Image
              src="/assets/images/misc/schedule-success.svg"
              alt="success"
              width={434}
              height={374}
              className="h-[374px] w-full md:h-[320px] md:w-[372px]"
            />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-5">
                <h5 className="text-2xl font-medium">
                  {t('title_notification')}
                </h5>
                <p className="text-center text-sm text-black/80">
                  {t('notification')}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center justify-center gap-x-2 md:gap-x-3">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/explore-story')}
                >
                  {isMobile ? t('mobile_btn_name_notification') : t('btn_name_notification')}
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/explore-story')}
                >
                  {t('back_to_home')}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {currentStep === 0 && <Step1 next={goToNextStep} />}
            {currentStep === 1 && <Step2 />}

            {currentStep === 2 && (
              <StoryForm
                type="create-first"
                onSucceed={() => setShowSuccess(true)}
                onBack={goToPreviousStep}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
