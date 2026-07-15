'use client';

import { Pacifico } from 'next/font/google';
import type { ReactNode } from 'react';
import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/libs/i18nNavigation';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/core/private/utils';
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
  const t = useTranslations('MiniGame');

  const numberOfAvailableMovements = useAppSelector(
    state => state.minigame.numOfAvailableMovements,
  );
  const guessedIds = useAppSelector(state => state.minigame.guessedIds);

  return (
    <div
      className={mergeClassnames(
        'overflow-y-auto w-screen h-screen bg-special-section-pattern p-4',
        pacifico.className,
      )}
    >
      {children}
      <Modal open={guessedIds.length === 12} onClose={() => { }}>
        <Modal.Backdrop />
        <Modal.Panel className="max-w-xs">
          <div className="flex h-48 w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-4">
            <h1 className="text-[28px] font-semibold capitalize text-slate-1000">
              {t('happy_year_of_dragon')}
            </h1>
            <h3 className="text-xl font-semibold capitalize text-slate-1000">
              {t('you_win', { numberOfAvailableMovements })}
            </h3>
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={() => router.push('/')}
            >
              {t('visit_website')}
            </Button>
          </div>
        </Modal.Panel>
      </Modal>
    </div>
  );
}
