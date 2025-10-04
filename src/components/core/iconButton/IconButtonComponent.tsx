import type { ElementType } from 'react';
import React from 'react';

import type { IconButtonProps } from './private/types';
import { getButtonSize, getButtonVariants } from './private/utils';
import getAnimation from '@/components/core/button/private/utils/getButtonAnimation';
import { getIconSize } from '@/components/core/button/private/utils/getButtonSizes';
import { getButtonCommonStyles } from '@/components/core/button/private/utils/getButtonStyles';
import { mergeClassnames } from '@/components/core/private/utils';

const IconButtonComponent = <C extends ElementType>({
  variant,
  size,
  disabled,
  animation,
  as,
  className,
  ...rest
}: IconButtonProps<C>) => {
  const Component = as || 'button';

  return (
    <Component
      className={mergeClassnames(
        getButtonSize(size),
        getButtonCommonStyles({ disabled }),
        getButtonVariants({ variant, disabled, animation }),
        animation === 'pulse'
        && (variant === 'fill' || variant === 'primary')
        && getAnimation('pulse'),
        animation === 'error' && getAnimation('error'),
        getIconSize(size),
        className,
      )}
      {...((!as || as === 'button') && { type: 'button' })}
      {...(disabled && { disabled })}
      {...rest}
    />
  );
};

export default IconButtonComponent;
