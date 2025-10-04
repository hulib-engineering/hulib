import React from 'react';

import { getBorderRadius } from './utils';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

type IContainerProps = WithChildren<{
  inputSize?: string;
}>;

const Container = ({ children, inputSize }: IContainerProps) => (
  <div
    className={mergeClassnames(
      'w-full max-w-full relative z-0',
      getBorderRadius(inputSize),
    )}
  >
    {children}
  </div>
);

export default Container;
