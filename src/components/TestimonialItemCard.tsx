import Image from 'next/image';
import React from 'react';

type ITestimonialItemCardProps = {
  avatarUrl: string;
  content: string;
  name: string;
  role: string;
};

const TestimonialItemCard = (props: ITestimonialItemCardProps) => (
  <div className="flex h-[20rem] w-[30rem] flex-col items-start gap-6 p-8 text-[#002254]">
    <div className="flex flex-[1_0_0] flex-col items-start justify-between self-stretch">
      <p className="flex-[1_0_0] self-stretch text-xl font-light leading-normal ">
        {props.content}
      </p>
      <div className="flex items-center gap-5">
        <Image
          alt={`${props.name} avatar`}
          src={props.avatarUrl}
          width={56} // cus 3.5rem * 16 = 56 px
          height={56}
          style={{ borderRadius: 56 }}
        />
        <div className="flex flex-col items-start">
          <p className="!my-0 text-xl font-semibold leading-[1.875rem]">
            {props.name}
          </p>
          <p className="!my-0 text-xl font-normal leading-[1.875rem]">
            {props.role}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TestimonialItemCard;
