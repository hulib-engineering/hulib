'use client';

import { Check } from '@phosphor-icons/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import CommonLayout from '@/layouts/CommonLayout';
import Step1 from '@/layouts/huber-registration/Step1';

const steps = [
  { no: '01', value: 'Info', num: 1 },
  { no: '02', value: 'Chose Available slot', num: 2 },
  { no: '03', value: 'Fist Story', num: 3 },
];

interface Form {
  bio: string;
  video?: string | undefined;
  isConfirmed: boolean;
}

const defaultValues: Form = {
  bio: '',
  video: '',
  isConfirmed: false,
};

const Page = () => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const { register, getValues } = useForm<Form>({
    defaultValues,
  });

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <Step1
          register={register}
          getValues={getValues}
          next={() => setCurrentStep((prev) => prev + 1)}
        />
      );
    }

    return undefined;
  };

  return (
    <CommonLayout className="flex w-full !flex-col items-center justify-center !bg-[#F9F9F9]">
      <div className="md:w-[37.5rem]">
        <div className="relative mb-4 flex w-full items-center justify-between px-8">
          <div className="absolute inset-x-0 top-4 z-0 flex w-full items-center justify-center pl-[4.125rem] pr-[5rem]">
            <div
              className={`h-0.5 w-1/2 ${
                currentStep > 1 ? 'bg-[#0162DD]' : 'bg-[#C2C6CF]'
              }`}
            />
            <div
              className={`h-0.5 w-1/2 ${
                currentStep > 2 ? 'bg-[#0162DD]' : 'bg-[#C2C6CF]'
              }`}
            />
          </div>
          {steps.map((item) => (
            <div
              key={item.no}
              className="flex flex-col items-center justify-center gap-2.5 text-[13px]"
            >
              <div
                className={`relative z-10 flex size-8 items-center justify-center rounded-full border-[2px] border-solid bg-white font-medium ${
                  currentStep === item.num
                    ? 'border-[#0162DD] text-[#0162DD]'
                    : 'border-[#C2C6CF] text-[#C7C9CB]'
                } ${item.num < currentStep && 'bg-[#0162DD] text-white'}`}
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
                    ? 'font-bold text-[#0162DD] '
                    : 'font-medium text-[#465668]'
                }`}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
        {renderStep()}
      </div>
    </CommonLayout>
  );
};

export default Page;
