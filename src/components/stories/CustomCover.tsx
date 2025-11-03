import React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import { svnRio } from '@/templates/BaseTemplate';

type ICustomCoverProps = {
  titleStory: string;
  authorName: string;
  active?: boolean;
  srcImage?: string;
};

const CustomCover = ({
  titleStory,
  authorName,
  active = true,
  srcImage = '',
}: ICustomCoverProps) => (
  <div
    id="cover-book"
    className={mergeClassnames(
      'relative h-[198px] w-[140px] rounded bg-cover bg-no-repeat lg:h-[255px] lg:w-[180px]',
      !active && 'grayscale',
    )}
    style={{
      backgroundImage: `url(${
        srcImage
        || '/assets/images/cover-book/story_background_yellow.png'
      })`,
    }}
  >
    <div
      className={mergeClassnames(
        'absolute left-0 top-2 line-clamp-3 w-full max-w-[180px] whitespace-pre-line text-wrap px-3 text-center text-lg text-primary-50',
        'sm:px-5 sm:text-[22px]',
        svnRio.className,
      )}
    >
      {titleStory}
    </div>
    <div
      className={mergeClassnames(
        'absolute bottom-2 left-0 line-clamp-3 w-full max-w-[180px] text-wrap px-3 text-center text-[10px] font-bold italic text-primary-50',
        'sm:px-5 sm:text-xs',
      )}
    >
      {`_${authorName}_`}
    </div>
  </div>
);

export { CustomCover };
