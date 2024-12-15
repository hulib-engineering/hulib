'use client';

import { X } from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

export const AboutPanel = () => {
  const listSkill = [
    'Front-end Development',
    'User Experience Design',
    'User Interface Design',
    'Typography',
  ];
  return (
    <>
      <div className="flex flex-col gap-y-5 border-b-[0.5px] border-neutral-90 py-8">
        <div className="flex items-center justify-between gap-x-2.5">
          <h6 className="text-xl font-medium text-[#000000] ">About</h6>
          <div className="flex size-8 items-center justify-center rounded-full border-[2px] border-solid border-white bg-primary-90">
            <Image
              src="/assets/icons/pencil-simple.svg"
              alt="Caret Down Icon"
              width={16}
              height={16}
              loading="lazy"
              color="#033599"
            />
          </div>
        </div>
        <p className="text-sm font-normal text-[#000000CC]">
          Lorem ipsum dolor sit amet consectetur. Eget magna vel platea pulvinar
          tempor dui massa ut. Egestas nunc mi tristique ornare commodo vitae
          dignissim commodo. Pellentesque nulla nam ante turpis velit amet cras
          ac aliquam. Ut amet nulla lobortis amet.
        </p>
      </div>
      <div className="flex flex-col gap-y-5 border-b-[0.5px] border-neutral-90 py-8">
        <div className="flex items-center justify-between gap-x-2.5">
          <h6 className="text-xl font-medium text-[#000000] ">Skills</h6>
          <div className="flex size-8 items-center justify-center rounded-full border-[2px] border-solid border-white bg-primary-90">
            <Image
              src="/assets/icons/pencil-simple.svg"
              alt="Caret Down Icon"
              width={16}
              height={16}
              loading="lazy"
              color="#033599"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2.5">
          {listSkill.map((skill, index) => {
            return (
              <div
                key={index}
                className="flex w-fit items-center gap-x-2 rounded-full bg-primary-50 px-3 py-2 text-sm font-medium text-primary-98"
              >
                <span>{skill}</span>
                <X size={16} color="#F0F5FF" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-y-5 py-8">
        <div className="flex items-center justify-between gap-x-2.5">
          <h6 className="text-xl font-medium text-[#000000] ">Education</h6>
          <div className="flex size-8 items-center justify-center rounded-full border-[2px] border-solid border-white bg-primary-90">
            <Image
              src="/assets/icons/pencil-simple.svg"
              alt="Caret Down Icon"
              width={16}
              height={16}
              loading="lazy"
              color="#033599"
            />
          </div>
        </div>
        <p className="text-sm font-normal text-[#000000CC]">
          FPT university (2020-2024)
        </p>
      </div>
    </>
  );
};
