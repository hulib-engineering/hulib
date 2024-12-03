import React from 'react';

import type { BradgeProps } from './private/type';

const Bradge = (props: BradgeProps) => {
  const { children, value = 0 } = props;
  return (
    <div className="relative">
      <div className="absolute -right-3.5 -top-1.5">
        <div className="flex h-[18px] w-[24px] items-center justify-center rounded-full border-[1px] border-solid border-white bg-red-50">
          <span className="mt-0.5 text-[10px] font-medium leading-[10px] text-white">
            {value}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Bradge;
