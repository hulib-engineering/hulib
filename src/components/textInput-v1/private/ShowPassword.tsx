import React from 'react';

import type { WithChildren } from '@/components/private/types';

type Props = WithChildren<{
  onClick: () => void;
}>;

const ShowPassword = ({ children, onClick }: Props) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
  <div
    role="alert"
    onClick={onClick}
    className="absolute end-4 top-1/2 z-[3] -mt-3 cursor-pointer text-sm leading-6 text-neutral-40 underline"
  >
    {children}
  </div>
);

export default ShowPassword;
