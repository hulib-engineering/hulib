'use client';

import React, { useEffect, useState } from 'react';

import Button from '@/components/button/Button';
import { svnRio } from '@/templates/BaseTemplate';
import { paginateText } from '@/utils/textUtils';

type IAnimatedCoverProps = {
  title: string;
  authorName: string;
  coverUrl: string;
  abstract: string;
  onClick: () => void;
};

export default function AnimatedCover(props: IAnimatedCoverProps) {
  const [abstractPages, setAbstractPages] = useState<string[]>([]);

  useEffect(() => {
    const calculateMaxCharWidth = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const fontSize = '14.21px'; // Example font size
      const fontFamily = 'DVN-Poppins'; // Example font family
      if (context) {
        context.font = `${fontSize} ${fontFamily}`;
        const testCharacter = 'W'; // Or 'M', or a string of characters
        const metrics = context.measureText(testCharacter);
        return metrics.width;
      }
      return 0;
    };

    const pages = paginateText(
      props.abstract,
      164,
      160,
      2,
      calculateMaxCharWidth(),
    );
    setAbstractPages(pages);
  }, [props.abstract]);

  return (
    <div className="h-full w-full bg-cover bg-no-repeat perspective-[1000px]">
      <div className="group relative h-full w-full">
        <div className="absolute m-0 flex h-full w-full flex-col items-center justify-between gap-[10px] rounded-[5px] bg-gradient-to-r from-[#9C9C9C] via-[#D5D5D5] via-5% to-[#f8f8f8] to-20% p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]  group-hover:z-10">
          <p className="font-['DVN-Poppins] text-sm leading-5 tracking-wider text-neutral-30">
            {`${abstractPages[1]}...`}
          </p>
          <Button onClick={props.onClick} className="w-11/12">
            Read all
          </Button>
        </div>
        <div className="absolute h-full w-full origin-left bg-gray-200 transition-all duration-500 ease-[cubic-bezier(0.50,0.00,0.25,1.00)] transform-style-3d rotate-y-0 group-hover:rotate-y-180">
          {/* Front Face */}
          <figure
            className="absolute m-0 h-full w-full bg-cover bg-no-repeat backface-hidden"
            style={{
              backgroundImage: `url(${
                props.coverUrl ||
                '/assets/images/cover-book/story_background_yellow.png'
              })`,
            }}
          >
            <div
              className={`absolute left-0 top-[8px] line-clamp-3 w-full max-w-[180px] text-wrap px-5 text-center text-[22px] text-primary-50 ${svnRio.className} whitespace-pre-line`}
            >
              {props.title}
            </div>
            <div className="absolute bottom-[8px] left-0 line-clamp-3 w-full max-w-[180px] text-wrap px-5 text-center text-xs font-bold italic text-primary-50">
              {`_${props.authorName}_`}
            </div>
          </figure>
          {/* Back Face */}
          <figure className="absolute m-0 flex h-full w-full flex-col justify-between gap-[10px] rounded bg-gradient-to-l from-[#b1b1b1] via-[#e3e3e3] via-5% to-[#f8f8f8] to-20% p-2 rotate-y-180 backface-hidden">
            <h6 className="text-xl font-medium leading-7 text-primary-10">
              {props.title}
            </h6>
            <p className="font-['DVN-Poppins] text-sm leading-5 tracking-wider text-neutral-30">
              {abstractPages[0]}
            </p>
          </figure>
        </div>
      </div>
    </div>
  );
}
