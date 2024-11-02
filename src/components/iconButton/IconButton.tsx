import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';
import React from 'react';

import IconButtonComponent from './IconButtonComponent';
import type { IconButtonProps } from './private/types';
import { AnimationContent, getAriaLabel } from './private/utils';

type Props<C extends ElementType> = PropsWithChildren<IconButtonProps<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof IconButtonProps<C>>;

const IconButton = <C extends ElementType = 'button'>({
  children,
  variant = 'fill',
  size = 'md',
  icon,
  disabled,
  animation,
  as,
  className,
  'aria-label': ariaLabel,
  ...rest
}: Props<C>) => {
  const hasAnimationContent =
    animation === 'progress' || animation === 'success';

  return (
    <IconButtonComponent
      size={size}
      variant={variant}
      icon={icon}
      disabled={disabled}
      animation={animation}
      as={as}
      className={className}
      aria-label={getAriaLabel({ ariaLabel, animation })}
      {...rest}
    >
      {hasAnimationContent ? (
        <AnimationContent
          icon={icon}
          animation={animation}
          size={size}
          variant={variant}
        >
          {children}
        </AnimationContent>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </IconButtonComponent>
  );
};

export default IconButton;
