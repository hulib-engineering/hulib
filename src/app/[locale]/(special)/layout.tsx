'use client';

import { Pacifico } from 'next/font/google';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import React from 'react';

import Button from '@/components/button/Button';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';

const pacifico = Pacifico({
  subsets: ['latin', 'vietnamese'],
  weight: ['400'],
});

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const numberOfAvailableMovements = useAppSelector(
    (state) => state.minigame.numOfAvailableMovements,
  );
  const guessedIds = useAppSelector((state) => state.minigame.guessedIds);

  return (
    <div
      className={mergeClassnames(
        'overflow-y-auto w-screen h-screen bg-special-section-pattern p-4',
        pacifico.className,
      )}
    >
      {children}
      <Modal open={guessedIds.length === 12} onClose={() => {}}>
        <Modal.Backdrop />
        <Modal.Panel className="max-w-80">
          <div className="flex h-48 w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4">
            <h1 className="text-[28px] font-semibold capitalize text-slate-1000">
              happy year of dragon
            </h1>
            <h3 className="text-xl font-semibold capitalize text-slate-1000">
              {`You win in ${numberOfAvailableMovements} moves!`}
            </h3>
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={() => router.push('/')}
            >
              visit website
              {/* {t('txt_accept')} */}
            </Button>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
}
