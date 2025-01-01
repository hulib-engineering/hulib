'use client';

import { Bell, CaretDown, MessengerLogo } from '@phosphor-icons/react';
import Image from 'next/image';
import React from 'react';

import Button from '@/components/button/Button';
import IconButton from '@/components/iconButton/IconButton';
import { Logo } from '@/components/Logo';
import type { WithChildren } from '@/components/private/types';
import SearchEverything from '@/components/SearchEverything';
import { useAppSelector } from '@/libs/hooks';

const ButtonWithChip = ({
  children,
  value,
}: WithChildren<{ value: string }>) => (
  <div className="relative">
    <div className="absolute left-6 top-0.5 z-10 rounded-full border border-white bg-red-50 px-1 py-[0.5px] text-[10px] leading-3 text-white">
      {value}
    </div>
    {children}
  </div>
);

const Header = () => {
  const user = useAppSelector((state) => state.auth.userInfo);

  return (
    <>
      <header className="flex w-full flex-col gap-5 bg-white px-4 pb-2 pt-4 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:hidden">
        <div className="flex items-center justify-between">
          <Logo size="small" />
          {!user || !user?.id ? (
            <div className="flex gap-3">
              <Button variant="outline">Log In</Button>
              <Button>Sign Up</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonWithChip value="10">
                <IconButton
                  variant="ghost"
                  icon={<MessengerLogo size={28} />}
                  className="p-2"
                  data-testid="button-messenger"
                  onClick={() => alert('click')}
                />
              </ButtonWithChip>
              <ButtonWithChip value="10">
                <IconButton
                  variant="ghost"
                  icon={<Bell size={28} />}
                  className="p-2"
                  data-testid="button-notif"
                  onClick={() => alert('click')}
                />
              </ButtonWithChip>
              <div className="relative ml-2">
                <Image
                  alt="Avatar Icon"
                  width={44}
                  height={44}
                  loading="lazy"
                  src={
                    !user || !user.photo || !user.photo.path
                      ? '/assets/images/icons/avatar.svg'
                      : user.photo.path
                  }
                  className="h-11 w-11 object-contain"
                />
                <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
                  <CaretDown size={12} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <SearchEverything />
          <div className="flex items-center justify-between">
            {user && user?.id && (
              <Button variant="ghost" size="lg" className="text-neutral-10">
                My schedule
              </Button>
            )}
            <Button variant="ghost" size="lg" className="text-neutral-10">
              Books
            </Button>
            <Button variant="ghost" size="lg" className="text-neutral-10">
              Mentors
            </Button>
          </div>
        </div>
      </header>
      <header className="hidden w-full items-center justify-between bg-white px-28 py-6 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:flex">
        <div className="flex items-center gap-6">
          <Logo size="small" />
          <div className="flex items-center">
            {user && user?.id && (
              <Button variant="ghost" size="lg" className="text-neutral-10">
                My schedule
              </Button>
            )}
            <Button variant="ghost" size="lg" className="text-neutral-10">
              Books
            </Button>
            <Button variant="ghost" size="lg" className="text-neutral-10">
              Mentors
            </Button>
          </div>
        </div>
        <div className="w-[300px]">
          <SearchEverything />
        </div>
        {!user || !user?.id ? (
          <div className="flex gap-3">
            <Button variant="outline">Log In</Button>
            <Button>Sign Up</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ButtonWithChip value="10">
              <IconButton
                variant="ghost"
                icon={<MessengerLogo size={28} />}
                className="p-2"
                data-testid="button-messenger"
                onClick={() => alert('click')}
              />
            </ButtonWithChip>
            <ButtonWithChip value="10">
              <IconButton
                variant="ghost"
                icon={<Bell size={28} />}
                className="p-2"
                data-testid="button-notif"
                onClick={() => alert('click')}
              />
            </ButtonWithChip>
            <div className="relative ml-2 h-11 w-11">
              <Image
                alt="Avatar Icon"
                layout="fill"
                className="h-11 w-11 object-contain"
                loading="lazy"
                src={
                  !user || !user.photo || !user.photo.path
                    ? '/assets/images/icons/avatar.svg'
                    : user.photo.path
                }
              />
              <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
                <CaretDown size={12} />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
