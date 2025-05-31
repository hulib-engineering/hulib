import Image from 'next/image';
import { useState } from 'react';

import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';
import { svnRio } from '@/templates/BaseTemplate';

const BookPart = ({
  className,
  children,
}: WithChildren<{ className?: string }>) => (
  <div
    className={mergeClassnames(
      'flex absolute inset-0 w-full h-full rounded',
      'transform-style-3d transition-all duration-[400ms] ease-in-out will-change-transform origin-[0%_50%_0]',
      className,
    )}
  >
    {children}
  </div>
);

type IFlipBookProps = {
  title: string;
  author: string;
  coverUrl?: string;
};

const FlipBook = (props: IFlipBookProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="m-auto h-[255px] w-[180px]">
      <div
        className={mergeClassnames(
          'relative h-[255px] w-[180px] transition-all duration-200 ease-in-out perspective-[900]',
          'hover:rotate-3 hover:shadow-none',
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <BookPart
          // id="cover-book"
          className={mergeClassnames(
            'justify-end items-start flex-col z-[2] overflow-hidden',
            isHovering && 'rotate-y-[-37deg]',
          )}
        >
          <div
            className={`absolute left-0 top-[8px] line-clamp-3 w-full max-w-[180px] text-wrap px-5 text-center text-[22px] text-primary-50 ${svnRio.className} whitespace-pre-line`}
          >
            {props.title}
          </div>
          <div className="absolute bottom-[8px] left-0 line-clamp-3 w-full max-w-[180px] text-wrap px-5 text-center text-xs font-bold italic text-primary-50">
            {`_${props.author || 'author name'}_`}
          </div>
          <Image
            src={
              props.coverUrl ??
              '/assets/images/cover-book/story_background_yellow.png'
            }
            alt={`${props.title} - ${props.author}`}
            width={180}
            height={255}
          />
        </BookPart>
        <BookPart
          className={mergeClassnames(
            isHovering &&
              'rotate-y-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]',
          )}
        />
        <BookPart
          className={mergeClassnames(
            isHovering &&
              'rotate-y-[-24deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]',
          )}
        />
        <BookPart
          className={mergeClassnames(
            isHovering &&
              'rotate-y-[-31deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]',
          )}
        />
      </div>
    </div>
  );
};

export default FlipBook;
