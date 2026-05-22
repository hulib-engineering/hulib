'use client';

import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { Cover } from '@/features/stories/components/Cover';
import { renderHighlightedText } from '@/features/stories/utils/renderHighlightedText';
import { paginateText } from '@/utils/paginateTextUtil';

type IAnimatedCoverProps = {
  title: string;
  authorName?: string;
  coverUrl: string;
  abstract: string;
  highlightTitle?: string;
  highlightAbstract?: string;
  isPublished?: boolean;
  onClick: () => void;
};

export default function AnimatedCover(props: IAnimatedCoverProps) {
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [abstractPages, setAbstractPages] = useState<string[]>([]);

  useEffect(() => {
    const pages = paginateText(
      props.highlightAbstract || props.abstract,
      164,
      173,
      textContainerRef,
      true,
    );
    setAbstractPages(pages.map((page: { content: string }) => page.content));
  }, [props.abstract, props.highlightAbstract]);

  return (
    <div className="size-full bg-cover bg-no-repeat perspective-[1000px]">
      <div className="group relative size-full">
        <div
          className={mergeClassnames(
            'absolute m-0 flex size-full flex-col items-center justify-between gap-[10px] rounded-[5px] p-2',
            'bg-right-page',
            'group-hover:z-10',
          )}
        >
          <p ref={textContainerRef} className="font-['DVN-Poppins] break-all text-xs leading-5 tracking-[0.015em] text-neutral-30 lg:text-sm">
            {props.highlightAbstract
              ? renderHighlightedText(`${abstractPages[1]}...`)
              : `${abstractPages[1]}...`}
          </p>
          <Button
            onClick={props.onClick}
            className="w-11/12 text-sm sm:text-base"
          >
            {props.isPublished ? 'Read all' : 'Preview'}
          </Button>
        </div>
        <div
          className={mergeClassnames(
            'absolute size-full origin-left',
            'transition-all duration-500 ease-[cubic-bezier(0.50,0.00,0.25,1.00)] transform-style-3d rotate-y-0',
            'group-hover:rotate-y-180',
          )}
        >
          <div
            className="absolute backface-hidden"
            style={{ top: 0, left: 0, right: -4, bottom: -4 }}
          >
            <Cover
              src={props.coverUrl}
              className="size-full"
            />
          </div>
          <figure className="absolute m-0 flex size-full flex-col justify-between gap-[10px] rounded bg-left-page p-2 backface-hidden rotate-y-180">
            <h6 className="line-clamp-2 text-lg font-medium leading-6 text-primary-10 sm:text-xl sm:leading-7">
              {props.title}
            </h6>
            <p className="font-['DVN-Poppins] break-all text-xs leading-5 tracking-wider text-neutral-30 sm:text-sm">
              {props.highlightAbstract
                ? renderHighlightedText(`${abstractPages[0]}...`)
                : `${abstractPages[0]}...`}
            </p>
          </figure>
        </div>
      </div>
    </div>
  );
}
