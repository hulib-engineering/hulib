import React from 'react';

import { mergeClassnames } from '@/components/private/utils';

const FeatureCard = (props: {
  bgColor: string;
  shadowColor: string;
  title: string;
  description: string;
}) => (
  <div
    className={mergeClassnames(
      'flex-col items-start gap-2 self-stretch rounded-[1.25rem] border-4 border-solid',
      'border-white p-8 text-slate-1000 backdrop-blur-[50px]',
      props.bgColor,
      props.shadowColor,
    )}
  >
    <div className="relative mb-4 h-[3.75rem] w-[3.75rem] rounded-[3.125rem] border-2 border-solid border-slate-1000 bg-white" />
    <h1>{props.title}</h1>
    <p className="relative mt-2 text-base font-light leading-6 opacity-80">
      {props.description}
    </p>
  </div>
);

export default FeatureCard;
