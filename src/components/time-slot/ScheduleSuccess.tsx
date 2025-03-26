'use client';

import Image from 'next/image';
import imageSuccess from 'public/assets/images/schedule-success.svg';
import * as React from 'react';

import Button from '@/components/button/Button';

export const ScheduleSuccess = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between rounded-3xl bg-white p-4 md:p-8">
      <div className="flex w-full flex-col items-center gap-y-4 md:w-[480px]">
        <Image src={imageSuccess} alt="success" width={480} height={420} />
        <h4 className="text-[28px] font-medium">Congratulation!</h4>
        <p className="text-sm text-neutral-30">
          You have successfully sent a meeting request to Huber
        </p>
        <div className="grid grid-cols-2 items-center  justify-items-center gap-x-4">
          <Button variant="outline" className="w-full">
            Your schedule
          </Button>
          <Button variant="primary" className="w-full">
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};
