import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';
import { useSwiperSlide } from 'swiper/react';

import { mergeClassnames } from '@/components/private/utils';

type ITestimonialItemCardProps =
  | {
      avatarUrl: string;
      content: string;
      name: string;
      role: string;
      className?: string;
      isPopup: true;
      onClose: () => void;
    }
  | {
      avatarUrl: string;
      content: string;
      name: string;
      role: string;
      className?: string;
      isPopup?: false;
      onClick: () => void;
    };

const TestimonialItemCard = (props: ITestimonialItemCardProps) => {
  const currentSlide = useSwiperSlide();

  const handleSlideClick = () => {
    if (currentSlide.isActive && !props.isPopup) {
      props.onClick();
    }
  };

  if (props.isPopup) {
    return (
      <div className="w-full rounded-3xl bg-white p-12">
        <div className="mb-8 inline-flex w-full items-center justify-between">
          <div className="flex items-center justify-start gap-5">
            <Image
              alt="Member avatar"
              src={props.avatarUrl}
              width={56} // cus 3.5rem * 16 = 56 px
              height={56}
              className="h-14 w-14 rounded-full object-cover object-center"
              loading="lazy"
            />
            <div className="flex flex-col items-start text-xl">
              <p className="font-semibold">{props.name}</p>
              <p className="font-normal">{props.role}</p>
            </div>
          </div>
          <button type="button" onClick={props.onClose}>
            <XMarkIcon width={24} height={24} />
          </button>
          {/* <div className="flex h-6 w-6 items-center justify-center"> */}
          {/*  <div className="relative flex h-6 w-6 flex-col items-start justify-start" /> */}
          {/* </div> */}
        </div>
        <p className="text-wrap text-xl font-light">{props.content}</p>
      </div>
    );
  }

  return (
    <div
      role="presentation"
      className={mergeClassnames(
        'h-[22rem] rounded-xl bg-white p-6 hover:shadow-[0px_8px_24px_#0061ef14] transition-all duration-200 ease-linear scale-90',
        currentSlide && currentSlide.isActive && 'scale-120',
        props.className && props.className,
      )}
      onClick={handleSlideClick}
    >
      <div className="flex h-full shrink grow basis-0 flex-col items-start justify-between">
        <p
          className={mergeClassnames(
            'self-stretch text-wrap text-xl font-light',
            currentSlide && currentSlide.isActive
              ? 'line-clamp-6'
              : 'line-clamp-4',
            !currentSlide && 'line-clamp-none',
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
            loading="lazy"
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
