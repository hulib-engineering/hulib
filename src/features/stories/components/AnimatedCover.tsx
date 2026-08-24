'use client';

import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import { Cover } from '@/features/stories/components/Cover';
import {
  createCanvasTextMeasurer,
  splitAbstractForPages,
  splitTextIntoSentences,
} from '@/utils/splitTextBySentences';

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

/** Read the rendered text style of an element for accurate measurement. */
function buildTextStyle(el: HTMLElement) {
  const style = window.getComputedStyle(el);
  const fontSize = Number.parseFloat(style.fontSize);
  const lineHeight = Number.parseFloat(style.lineHeight) || fontSize * 1.5;
  const letterSpacing = style.letterSpacing === 'normal'
    ? 0
    : Number.parseFloat(style.letterSpacing) || 0;

  return {
    fontSize,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    lineHeightPx: lineHeight,
    letterSpacingPx: letterSpacing,
    // The paragraphs use Tailwind's `break-all`
    breakAll: true,
  };
}

/** Fallback half/half split used before the first measurement (e.g. SSR). */
function fallbackSplit(text: string) {
  const sentences = splitTextIntoSentences(text);
  const midIndex = Math.ceil(sentences.length / 2);
  return {
    leftPageContent: sentences.slice(0, midIndex).join(' '),
    rightPageContent: sentences.slice(midIndex).join(' '),
  };
}

export default function AnimatedCover(props: IAnimatedCoverProps) {
  const abstractText = props.highlightAbstract || props.abstract;
  const [pages, setPages] = useState(() => fallbackSplit(abstractText));

  const leftTextRef = useRef<HTMLParagraphElement>(null);
  const rightTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const leftEl = leftTextRef.current;
    const rightEl = rightTextRef.current;
    if (!leftEl || !rightEl) {
      return;
    }

    const fit = () => {
      const leftBox = { width: leftEl.clientWidth, height: leftEl.clientHeight };
      const rightBox = { width: rightEl.clientWidth, height: rightEl.clientHeight };
      if (leftBox.width === 0 || rightBox.width === 0) {
        return;
      }

      const textStyle = buildTextStyle(leftEl);
      const result = splitAbstractForPages({
        abstract: abstractText,
        leftBox,
        rightBox,
        textStyle,
        measure: createCanvasTextMeasurer(textStyle),
      });

      setPages({
        leftPageContent: result.leftPageContent,
        rightPageContent: result.rightPageContent,
      });
    };

    fit();

    // Re-fit whenever either page box resizes (responsive, button toggle, etc.)
    const observer = new ResizeObserver(fit);
    observer.observe(leftEl);
    observer.observe(rightEl);

    // Webfonts change text metrics once loaded — measure again
    document.fonts?.ready.then(fit).catch(() => {});

    return () => {
      observer.disconnect();
    };
  }, [abstractText]);

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
          <p
            ref={rightTextRef}
            className="font-['DVN-Poppins] min-h-0 flex-1 overflow-hidden break-all text-xs leading-5 tracking-[0.015em] text-neutral-30 lg:text-sm"
          >
            {pages.rightPageContent !== undefined ? pages.rightPageContent : null}
          </p>
          {!props.isPublished && (
            <Button
              onClick={props.onClick}
              className="w-11/12 text-sm sm:text-base"
            >
              {props.isPublished ? 'Read all' : 'Preview'}
            </Button>
          )}
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
            <Cover src={props.coverUrl} className="size-full" />
          </div>
          <figure className="absolute m-0 flex size-full flex-col justify-between gap-[10px] overflow-hidden rounded bg-left-page p-2 backface-hidden rotate-y-180">
            {!props.isPublished && (
              <h6 className="line-clamp-2 text-lg font-medium leading-6 text-primary-10 sm:text-xl sm:leading-7">
                {props.title}
              </h6>
            )}
            <p
              ref={leftTextRef}
              className="font-['DVN-Poppins] min-h-0 flex-1 overflow-hidden break-all text-xs leading-5 tracking-wider text-neutral-30 sm:text-sm"
            >
              {pages.leftPageContent !== undefined ? pages.leftPageContent : null}
            </p>
          </figure>
        </div>
      </div>
    </div>
  );
}
