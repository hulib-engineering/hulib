'use client';

import React, { useState } from 'react';
import {
  BookOpenIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { useDraftStories } from '@/utils/loadDraft';
import type { Story } from '@/libs/services/modules/stories/storiesType';

export default function ContinueBookCard() {
  const t = useTranslations('ContinueBookCard');

  const { draftStories, isLoading } = useDraftStories();
  const [hasDraftPopup, setHasDraftPopup] = useState(true);

  if (isLoading || !hasDraftPopup || draftStories.length === 0) {
    return;
  }

  // TODO: change tailwind codes to calculate top nav bar height, then replace top-[100px] with it
  return (
    <div
      className="absolute right-0 top-[100px] z-10
      flex flex-col items-center gap-1 lg:right-[92px]"
    >
      <div
        className="flex flex-col gap-4 rounded-md
        border-2 border-primary-60 bg-white p-4 "
      >
        <h2 className="font-bold">{t('title')}</h2>

        {draftStories.map((draft: Story) => (
          <div
            key={draft.id}
            className="flex flex-row items-center gap-2 rounded-md bg-neutral-90 p-2 font-medium"
          >
            <BookOpenIcon size={24} color="#0858FA" />
            <span className="mt-1">{draft.title}</span>
          </div>
        ))}

        <Button>{t('button')}</Button>
      </div>

      <IconButton variant="outline" className="size-[32px] shrink-0" onClick={() => setHasDraftPopup(false)} aria-label="close">
        <XIcon className="shrink-0" />
      </IconButton>
    </div>
  );
}
