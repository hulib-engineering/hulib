'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import imageSuccess from 'public/assets/images/schedule-success.svg';
import * as React from 'react';

import Button from '@/components/button/Button';

export const SuccessScreen = ({
  title = 'Congratulation',
  notification,
  nameButton,
  linkButton,
}: {
  title?: string;
  notification: string;
  nameButton: string;
  linkButton: string;
}) => {
  const router = useRouter();
  const handleBackToHome = () => {
    router.push('/home');
    // router.refresh();
  };

  const isMobile = window.innerWidth < 480;

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-3xl bg-white p-4 md:p-8">
      <div className="flex w-full flex-col items-center gap-y-4 md:w-[480px]">
        <Image
          src={imageSuccess}
          alt="success"
          width={isMobile ? 300 : 480}
          height={isMobile ? 350 : 420}
        />
        <h4 className="text-[28px] font-medium">{`${title}!`}</h4>
        <p className="text-center text-sm text-neutral-30">{notification}</p>
        <div className="grid grid-cols-2 items-center justify-center gap-x-2 md:gap-x-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleBackToHome}
          >
            Back to Homepage
          </Button>
          <Link href={linkButton}>
            <Button variant="primary" className="w-full">
              {nameButton}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
