'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import Button from '@/components/button/Button';
import { Env } from '@/libs/Env.mjs';

export const SubmittedSuccess = () => {
  const router = useRouter();
  return (
    <div className="mx-auto flex max-w-[480px] flex-col items-center justify-center gap-y-4 border border-gray-200 p-4 shadow-sm">
      <Image
        alt="Illustration image"
        src="/assets/images/sumitted-story.svg"
        priority
        width={450}
        height={400}
        className="object-contain"
      />
      <h5 className="text-2xl font-medium">Submitted</h5>
      <p className="justify-center text-sm text-gray-500">
        &quot;Thanks for your story! HuLib will keep you informed when our
        process completes. Feel free to reach out at&nbsp;
        <a
          href={`mailto:${Env.NEXT_PUBLIC_CONTACT_EMAIL}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary-50"
        >
          contact@hulib.org
        </a>
        &nbsp;with any questions. We look forward to your participation as a
        Huber!&quot;
      </p>
      <Button
        className="w-fit rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
        onClick={() => router.push('/home')}
      >
        Back to Home
      </Button>
    </div>
  );
};
