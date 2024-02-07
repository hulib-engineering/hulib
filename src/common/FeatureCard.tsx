import Image from 'next/image';
import React from 'react';

type Props = {
  imageUrl: string;
  heading: string;
  content: string;
  bgColor: string;
};

const FeatureCard = (feat: Props) => {
  return (
    <div
      style={{ backgroundColor: feat.bgColor }}
      className="flex max-w-96 flex-[1_0_0] flex-col items-start gap-2 self-stretch rounded-[1.25rem] border-4 border-solid border-white p-8  text-[#002254] shadow-[0_12px_24px_0_rgba(187,249,158,0.25)] backdrop-blur-[50px]"
    >
      <div className="flex flex-col items-start gap-4">
        <Image
          width={60}
          height={60}
          src=""
          alt=""
          className="h-[3.75rem] w-[3.75rem] rounded-[3.125rem] border-2 border-solid border-[#002254] bg-white"
        />
        <p className="!my-0 text-2xl font-medium leading-normal" />
      </div>
      <h1>{feat.heading}</h1>
      <p className="!my-0 self-stretch text-base font-light leading-6  opacity-80">
        {feat.content}
      </p>
    </div>
  );
};

export default FeatureCard;
