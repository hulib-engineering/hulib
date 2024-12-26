'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { pushError } from '@/components/CustomToastifyContainer';
import MentorRegisterStep1 from '@/components/mentor-register/MentorRegisterStep1';
import MentorRegisterStep2 from '@/components/mentor-register/MentorRegisterStep2';
import StepCircle from '@/components/mentor-register/StepCircle';
import Success from '@/components/mentor-register/Success';
import { MentorRegisterValidation } from '@/validations/MentorRegisterValidation';

const defaultValues = {
  about: '',
  sections: '',
  education: '',
  from: 2024,
  to: 2024,
};

const Index = () => {
  const t = useTranslations('MentorRegister');
  const [currentStep, setCurrentStep] = React.useState(0);
  const [success, setSuccess] = React.useState(false);

  const methods = useForm<z.infer<typeof MentorRegisterValidation>>({
    resolver: zodResolver(MentorRegisterValidation),
    defaultValues,
  });

  const isValid = (data: z.infer<typeof MentorRegisterValidation>) => {
    const { about, education, from, sections, to } = data;
    if (about.length === 0 || education.length === 0 || sections.length === 0) {
      return false;
    }

    if (from < to) {
      return false;
    }
    return true;
  };

  const onNextPress = React.useCallback(
    (data: z.infer<typeof MentorRegisterValidation>) => {
      try {
        if (isValid(data)) {
          setCurrentStep(1);
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    [],
  );

  const onGoBackPress = React.useCallback(() => {
    setCurrentStep(0);
  }, []);

  const onRegisterPress = React.useCallback((file: File | null) => {
    if (!file) {
      pushError(t('error_form_no_video'));
    }

    const data = methods.getValues();
    const form = {
      ...data,
      file,
    };

    console.log(form);
    setSuccess(true);
  }, []);

  const renderCurrentStepSection = React.useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <MentorRegisterStep1 methods={methods} onNextPress={onNextPress} />
        );
      case 1:
        return (
          <MentorRegisterStep2
            onGoBackPress={onGoBackPress}
            onRegisterPress={onRegisterPress}
          />
        );
      default:
        return null;
    }
  }, [currentStep, methods, onNextPress, onGoBackPress, onRegisterPress]);

  return (
    <div className="flex flex-col items-center justify-center">
      {success ? (
        <Success />
      ) : (
        <div className="flex w-[592px] flex-col gap-16 p-10">
          <div className="flex flex-row items-center justify-between">
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
          <div className="rounded-lg bg-white">
            <p className="mb-10 text-4xl font-medium leading-[44px] text-black">
              {t('register_as_a_human_book')}
            </p>
            {renderCurrentStepSection()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
