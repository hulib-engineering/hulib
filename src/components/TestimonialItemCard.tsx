import Image from 'next/image';
import React from 'react';
import { useSwiperSlide } from 'swiper/react';

import { mergeClassnames } from '@/components/private/utils';

type ITestimonialItemCardProps = {
  avatarUrl: string;
  content: string;
  name: string;
  role: string;
  className?: string;
};

const TestimonialItemCard = (props: ITestimonialItemCardProps) => {
  const parentSlide = useSwiperSlide();

  return (
    <div
      className={mergeClassnames(
        'h-[22rem] rounded-xl bg-white p-6 hover:shadow-[0px_8px_24px_#0061ef14] transition-all duration-200 ease-linear scale-90',
        // parentSlide.isActive ? 'w-[30rem] h-[25rem]' : 'w-[27.5rem] h-[22rem]',
        parentSlide && parentSlide.isActive && 'scale-120',
        props.className && props.className,
      )}
    >
      <div className="flex h-full shrink grow basis-0 flex-col items-start justify-between">
        <p
          className={mergeClassnames(
            'self-stretch text-wrap text-xl font-light',
            parentSlide && parentSlide.isActive
              ? 'line-clamp-6'
              : 'line-clamp-4',
            !parentSlide && 'line-clamp-none',
          )}
        >
          {props.content}
        </p>
        <div className="flex items-center gap-5">
          <Image
            alt="Member avatar"
            src={props.avatarUrl}
            width={56} // cus 3.5rem * 16 = 56 px
            height={56}
            className="h-14 w-14 rounded-full object-cover object-center"
          />
          <div className="flex flex-col items-start text-xl">
            <p className="font-semibold">{props.name}</p>
            <p className="font-normal">{props.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialItemCard;
