'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import Bradge from '@/components/bradge/Bradge';
import { Logo } from '@/components/Logo';
import SearchInput from '@/components/SearchInput';
import { useDeviceType } from '@/libs/hooks';

const HeaderWebApp = () => {
  const t = useTranslations('HeaderWebApp');
  const [token] = React.useState<string | null>('123');
  const { deviceType } = useDeviceType();
  if (deviceType === 'mobile') {
    return (
      <header className="w-full">
        <div className="flex w-full flex-col items-center gap-5 bg-white p-6">
          <div className="flex w-full flex-row items-center justify-between">
            <Logo size="small" />
            <div>
              {token ? (
                <div className="flex flex-row items-center gap-6">
                  <Bradge value={10}>
                    <Image
                      src="/assets/images/icons/message.svg"
                      alt="Message Icon"
                      width={20}
                      height={20}
                      loading="lazy"
                    />
                  </Bradge>
                  <Bradge value={10}>
                    <Image
                      src="/assets/images/icons/bell.svg"
                      alt="Message Icon"
                      width={24}
                      height={24}
                      loading="lazy"
                    />
                  </Bradge>

                  <div className="relative">
                    <Image
                      alt="Avatar Icon"
                      width={44}
                      height={44}
                      loading="lazy"
                      src="/assets/images/icons/avatar.svg"
                    />
                    <div className="absolute left-7 top-7">
                      <div className="flex size-5 items-center justify-center rounded-full border-[2px] border-solid border-white bg-neutral-90">
                        <Image
                          src="/assets/images/icons/caret-down.svg"
                          alt="Caret Down Icon"
                          width={12}
                          height={12}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-3">
                  <div className="h-[40px] cursor-pointer rounded-md border-[1px] border-solid border-[#C2C6CF] bg-white px-3 text-base font-medium leading-[40px] text-primary-50 hover:opacity-90">
                    {t('log_in')}
                  </div>
                  <div className="h-[40px] cursor-pointer rounded-md bg-primary-50 px-3 text-base font-medium leading-[40px] text-white hover:opacity-90">
                    {t('sign_up')}
                  </div>
                </div>
              )}
            </div>
          </div>
          <SearchInput />
          <div className="flex w-full flex-row items-center justify-around">
            {token && (
              <span className="cursor-pointer text-base font-medium leading-5">
                {t('my_schedule')}
              </span>
            )}
            <span className="cursor-pointer text-base font-medium leading-5">
              {t('books')}
            </span>
            <span className="cursor-pointer text-base font-medium leading-5">
              {t('mentors')}
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full">
      <div className="flex w-full flex-row items-center justify-around bg-white py-6">
        <div className="flex w-fit flex-row items-center gap-10">
          <Logo size="small" />
          {token && (
            <span className="cursor-pointer text-base font-medium leading-5">
              {t('my_schedule')}
            </span>
          )}
          <span className="cursor-pointer text-base font-medium leading-5">
            {t('books')}
          </span>
          <span className="cursor-pointer text-base font-medium leading-5">
            {t('mentors')}
          </span>
        </div>
        <div className="w-[300px]">
          <SearchInput />
        </div>
        {token ? (
          <div className="flex flex-row items-center gap-6">
            <Bradge value={10}>
              <Image
                src="/assets/images/icons/message.svg"
                alt="Message Icon"
                width={22}
                height={22}
                loading="lazy"
              />
            </Bradge>
            <Bradge value={10}>
              <Image
                src="/assets/images/icons/bell.svg"
                alt="Message Icon"
                width={24}
                height={24}
                loading="lazy"
              />
            </Bradge>

            <div className="relative">
              <Image
                alt="Avatar Icon"
                width={44}
                height={44}
                loading="lazy"
                src="/assets/images/icons/avatar.svg"
              />
              <div className="absolute left-7 top-7">
                <div className="flex size-5 items-center justify-center rounded-full border-[2px] border-solid border-white bg-neutral-90">
                  <Image
                    src="/assets/images/icons/caret-down.svg"
                    alt="Caret Down Icon"
                    width={12}
                    height={12}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-3">
            <div className="h-[40px] cursor-pointer rounded-md border-[1px] border-solid border-[#C2C6CF] bg-white px-3 text-base font-medium leading-[40px] text-primary-50 hover:opacity-90">
              {t('log_in')}
            </div>
            <div className="h-[40px] cursor-pointer rounded-md bg-primary-50 px-3 text-base font-medium leading-[40px] text-white hover:opacity-90">
              {t('sign_up')}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderWebApp;
