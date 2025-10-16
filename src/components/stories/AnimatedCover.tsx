'use client';

import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { svnRio } from '@/templates/BaseTemplate';
import { paginateText } from '@/utils/paginateTextUtil';

function renderHighlightedText(text: string, highlightClass = 'bg-green-70/50') {
  if (!text) {
    return null;
  }

  // Split by <b> and </b>, keep track of highlighted segments
  const parts = text.split(/(<b>|<\/b>)/g);

  let isBold = false;
  return parts.map((part, index) => {
    if (part === '<b>') {
      isBold = true;
      return null;
    }
    if (part === '</b>') {
      isBold = false;
      return null;
    }
    if (isBold) {
      return (
        <span key={index} className={highlightClass}>
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

type IAnimatedCoverProps = {
  title: string;
  authorName: string;
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
            'bg-right-page drop-shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]',
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
        <div className={mergeClassnames(
          'absolute size-full origin-left rounded bg-gray-200',
          'transition-all duration-500 ease-[cubic-bezier(0.50,0.00,0.25,1.00)] transform-style-3d rotate-y-0',
          'group-hover:rotate-y-180',
        )}
        >
          {/* Front Face */}
          <figure
            className="absolute m-0 size-full bg-cover bg-no-repeat backface-hidden"
            style={{
              backgroundImage: `url(${
                props.coverUrl
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
              {props.title}
            </div>
            <div
              className={mergeClassnames(
                'absolute bottom-2 left-0 line-clamp-3 w-full max-w-[180px] text-wrap px-3 text-center text-[10px] font-bold italic text-primary-50',
                'sm:px-5 sm:text-xs',
              )}
            >
              {`_${props.authorName}_`}
            </div>
          </figure>
          {/* Back Face */}
          <figure className="absolute m-0 flex size-full flex-col justify-between gap-[10px] rounded bg-left-page p-2 backface-hidden rotate-y-180">
            <h6 className="line-clamp-2 text-lg font-medium leading-6 text-primary-10 sm:text-xl sm:leading-7">
              {props.title}
              {/* {props.highlightTitle */}
              {/*  ? ( */}
              {/*    // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
              {/*      <div dangerouslySetInnerHTML={{ __html: props.highlightTitle || '' }} /> */}
              {/*    ) */}
              {/*  : ( */}
              {/*      `${props.title}` */}
              {/*    )} */}
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
