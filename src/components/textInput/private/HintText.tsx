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
      'inline-block mt-2 ps-4 text-moon-12',
      isError ? 'text-red-50' : 'text-trunks',
    )}
  >
    {children}
  </p>
);

export default HintText;
