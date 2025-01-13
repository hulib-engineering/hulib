import Image from 'next/image';
import * as React from 'react';

export const EditIcon = () => {
  return (
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
  );
};
