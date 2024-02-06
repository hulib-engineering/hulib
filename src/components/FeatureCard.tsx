import Image from 'next/image';
import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

type IFeatureCardProps = {
  bgColor: string;
  shadowColor: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
};

const FeatureCard = (props: IFeatureCardProps) => (
  <div
    className={mergeClassnames(
      'flex-col items-start gap-2 self-stretch rounded-[1.25rem] border-4 border-solid',
      'border-white p-8 text-slate-1000 backdrop-blur-[50px]',
      props.bgColor,
      props.shadowColor,
    )}
  >
    {!props.thumbnailUrl ? (
      <div className="relative mb-4 h-[3.75rem] w-[3.75rem] rounded-[3.125rem] border-2 border-solid border-slate-1000 bg-white" />
    ) : (
      <Image
        src={props.thumbnailUrl}
        alt={props.thumbnailUrl}
        width={60}
        height={60}
        className="relative h-[3.75rem] w-[3.75rem]"
      />
    )}
    <h1>{props.title}</h1>
    <p className="relative mt-2 text-base font-light leading-6 opacity-80">
      {props.description}
    </p>
  </div>
);

export default FeatureCard;
