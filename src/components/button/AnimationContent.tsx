import { CheckIcon } from '@heroicons/react/24/solid';
import React from 'react';

import type { ButtonSettingsProps } from './private/types';
import { getIconSize, getLoaderSize } from './private/utils/getButtonSizes';
import { IconLeft, IconRight } from '@/components/button/ButtonComponent';
import { getLoaderColor } from '@/components/button/private/utils/getButtonStyles';
import Loader from '@/components/loader/Loader';
import { mergeClassnames } from '@/components/private/utils';

const AnimationContent = ({
  children,
  iconLeft,
  iconRight,
  iconOnly,
  animation,
  size,
  fullWidth,
  variant,
}: ButtonSettingsProps) => (
  <span className="pointer-events-none block h-full">
    <span
      className={mergeClassnames(
        'flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 content-center',
        'justify-center',
      )}
    >
      {animation === 'progress' && (
        <Loader size={getLoaderSize(size)} color={getLoaderColor(variant)} />
      )}
      {animation === 'success' && (
        <CheckIcon aria-label="Success" className={getIconSize(size)} />
      )}
    </span>
    <span className="flex items-center gap-2 opacity-0">
      {iconLeft && (
        <IconLeft fullWidth={fullWidth} iconLeft={iconLeft} size={size} />
      )}
      {children}
      {iconRight && (
        <IconRight fullWidth={fullWidth} iconRight={iconRight} size={size} />
      )}
      {iconOnly}
    </span>
  </span>
);

export default AnimationContent;
