import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { svnRio } from '@/templates/BaseTemplate';

type ICoverProps = {
  coverUrl: string;
  title: string;
  authorName: string;
  className?: string;
};

export const Cover = ({
  coverUrl,
  title,
  authorName,
  className,
}: ICoverProps) => (
  <div
    className={mergeClassnames(
      'w-[180px] h-64 relative bg-cover bg-no-repeat drop-shadow-md',
      className,
    )}
    style={{ backgroundImage: coverUrl ? `url('${coverUrl}')` : 'url(\'/assets/images/cover-book/story_background_yellow.png\')' }}
  >
    <div
      className={`absolute left-0 top-0 mx-auto line-clamp-3 w-full text-wrap px-3 text-center text-lg leading-none text-primary-50 sm:top-7 sm:px-5 sm:text-[22px] ${svnRio.className} whitespace-pre-line`}
    >
      {title}
    </div>
    <div className="absolute bottom-2 left-0 mx-auto flex w-full items-baseline justify-center gap-1 text-wrap text-center text-[10px] text-primary-50">
      <div className="h-0 w-4 border-t border-primary-50" />
      <span className="line-clamp-1">{authorName}</span>
      <div className="h-0 w-4 border-t border-primary-50" />
    </div>
  </div>
);
