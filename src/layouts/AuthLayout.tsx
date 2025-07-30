import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import React from 'react';

import { Logo } from '@/components/Logo';
import { mergeClassnames } from '@/components/private/utils';

type IAuthLayoutProps = {
  illustrationImage: string;
  children: ReactNode;
  pathName?: string;
};

const AuthLayout = (props: IAuthLayoutProps) => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-bl from-[#C1D5FF] to-[#7986E7] bg-blend-multiply xl:bg-none">
      <div
        className={mergeClassnames(
          'hidden h-screen w-5/12 items-center justify-center xl:flex',
          props.pathName
            ? props.pathName === 'login'
              ? 'bg-[#A6D4FF]'
              : 'bg-pink-90'
            : 'bg-yellow-90',
        )}
      >
        <Image
          alt="Illustration"
          className="h-auto w-5/6 object-contain"
          src={props.illustrationImage}
          width={600}
          height={1024}
        />
      </div>
      <div className="size-full bg-white p-12 sm:h-fit sm:w-3/4 sm:rounded-[26px] md:w-7/12 xl:h-full xl:p-0">
        <div className="m-auto flex size-full flex-col items-center justify-center gap-8 sm:w-5/6 xl:w-7/12">
          <Link href="/">
            <Logo />
          </Link>
          {props.children}
        </div>
      </div>
    </div>
  );
};
export { AuthLayout };
