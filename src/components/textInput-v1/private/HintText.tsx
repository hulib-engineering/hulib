import React from 'react';

import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

type Props = WithChildren<{
  isError?: boolean;
}>;

const HintText = ({ children, isError }: Props) => (
  <p
    role="alert"
    className={mergeClassnames(
      'inline-block mt-2 text-xs leading-[14px]',
      isError ? 'text-red-50' : 'text-neutral-60',
    )}
  >
    {children}
  </p>
);

export default HintText;
