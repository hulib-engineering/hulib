'use client';

import React, { useState } from 'react';
import {
  BookOpenIcon,
  XIcon,
} from '@phosphor-icons/react';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';

export default function ContinueBookCard({
  title = 'Bạn có cuốn sách cần hoàn thành !',
  ctaLabel = 'Tiếp tục hoàn thành',
}) {
  const [hasDraftPopup, setHasDraftPopup] = useState(false);
  const bookTitle = ['Cứ làm đi biết đâu thất bại', 'Cứ làm đi biết đâu thất bại 2', 'Cứ làm đi biết đâu thất bại 3'];

  if (!hasDraftPopup) {
    return;
  }

  // TODO: change tailwind codes to calculate top nav bar height, then replace top-[100px] with it
  return (
    <div
      className="absolute right-0 top-[100px] z-10
      flex flex-col items-center gap-1 lg:right-[92px]"
    >
      <div
        className="flex min-h-[172px]
        flex-col gap-4 rounded-md
        border-2 border-primary-60 bg-white p-4 "
        aria-label={title}
      >
        <h2 className="font-bold">{title}</h2>

        {bookTitle.map((title: string) => (
          <div
            key={title}
            className="flex flex-row items-center gap-2 rounded-md bg-neutral-90 p-2 font-medium"
          >
            <BookOpenIcon size={24} color="#0858FA" />
            <span className="mt-1">{title}</span>
          </div>
        ))}

        <Button>{ctaLabel}</Button>
      </div>

      <IconButton variant="outline" className="size-[32px] shrink-0" onClick={() => setHasDraftPopup(false)} aria-label="close">
        <XIcon className="shrink-0" />
      </IconButton>
    </div>
  );
}
