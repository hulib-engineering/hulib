import React from 'react';

import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

import { getBorderRadius } from './utils';

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
