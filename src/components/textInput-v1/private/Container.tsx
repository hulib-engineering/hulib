import React from 'react';

import type { WithChildren } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';

import { getBorderRadius } from './utils';

type IContainerProps = WithChildren<{
  disabled?: boolean;
  inputSize?: string;
}>;

const Container = ({ children, disabled, inputSize }: IContainerProps) => (
  <div
    className={mergeClassnames(
      'w-full max-w-full relative z-0',
      disabled && 'opacity-60 cursor-not-allowed',
      getBorderRadius(inputSize),
    )}
  >
    {children}
  </div>
);

export default Container;
