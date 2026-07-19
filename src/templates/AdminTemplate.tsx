'use client';

import { SessionProvider } from 'next-auth/react';

import { useEffect } from 'react';
import * as React from 'react';
import CustomToastifyContainer from '@/components/CustomToastifyContainer';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import { poppins } from '@/styles/fonts';
import Header from '@/layouts/admin/Header';
import { redirect } from '@/libs/i18nNavigation';
import { setAvatarUrl, setUserInfo } from '@/libs/store/authentication';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useAppDispatch } from '@/libs/hooks';

const AdminTemplate = (props: WithChildren) => {
  // const pathname = usePathname();

  const { data, error } = useGetPersonalInfoQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setUserInfo(data));
      dispatch(setAvatarUrl(data.photo));
    }
  }, [data, dispatch]);

  if (error) {
    return redirect('/auth/login');
  }

  return (
    <SessionProvider>
      <div
        className={mergeClassnames(
          poppins.className,
          'relative antialiased w-full min-h-screen flex flex-col',
        )}
      >
        <div className="flex h-max w-full flex-col gap-8 bg-neutral-98 pb-16">
          <Header />
          <main className="mx-auto flex w-full flex-1 xl:w-5/6 xl:max-w-7xl">
            {props.children}
          </main>
        </div>
        <CustomToastifyContainer />
      </div>
    </SessionProvider>
  );
};

export { AdminTemplate };
