import React from 'react';

import type { LoaderProps } from './private/types';
import { getDivBorder, getSize } from '@/components/loader/private/utils';
import { mergeClassnames } from '@/components/private/utils';

const Loader = ({
  color = 'border-primary-50',
  size = 'md',
  ariaLabel = 'Loading',
}: LoaderProps) => {
  const commonStyles = `absolute w-full h-full rounded-full animate-loader border-x-transparent border-b-transparent`;
  return (
    <div
      aria-label={ariaLabel}
      role="alert"
      aria-busy="true"
      className={mergeClassnames(
        getSize(size),
        'relative rounded-full rtl:-scale-x-100',
      )}
    >
      <div
        className={mergeClassnames(getDivBorder(size), color, commonStyles)}
        style={{ animationDelay: '-0.45s' }}
        role="presentation"
      />
      <div
        className={mergeClassnames(getDivBorder(size), color, commonStyles)}
        style={{ animationDelay: '-0.3s' }}
        role="presentation"
      />
      <div
        className={mergeClassnames(getDivBorder(size), color, commonStyles)}
        style={{ animationDelay: '-0.15s' }}
        role="presentation"
      />
      <div
        className={mergeClassnames(getDivBorder(size), color, commonStyles)}
        role="presentation"
      />
    </div>
  );
};

export default Loader;
