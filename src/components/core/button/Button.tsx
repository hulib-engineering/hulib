import type {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from 'react';
import React, { useCallback, useState } from 'react';

import AnimationContent from '@/components/core/button/AnimationContent';
import {
  ButtonComponent,
  Hover,
  IconLeft,
  IconRight,
} from '@/components/core/button/ButtonComponent';
import type { ButtonProps } from '@/components/core/button/private/types';

type Props<C extends ElementType> = PropsWithChildren<ButtonProps<C>> &
  Omit<ComponentPropsWithoutRef<C>, keyof ButtonProps<C>>;

const Button = <C extends ElementType = 'button'>({
  children,
  variant = 'fill',
  size = 'md',
  icon, // deprecated
  iconLeft, // not boolean anymore
  iconRight, // not boolean anymore
  iconOnly, // deprecated
  fullWidth,
  disabled,
  animation,
  as,
  className,
  ...rest
}: Props<C> & { shouldHover?: boolean }) => {
  const hasAnimationContent
    = animation === 'progress' || animation === 'success';

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = useCallback(() => setIsHover(true), [setIsHover]);
  const onMouseLeave = useCallback(() => setIsHover(false), [setIsHover]);

  // Only show the Hover component if we're not using custom hover classes
  const hasCustomHoverClasses = className?.includes('hover:');

  return (
    <ButtonComponent
      size={size}
      variant={variant}
      icon={icon}
      iconLeft={iconLeft}
      iconRight={iconRight}
      iconOnly={iconOnly}
      fullWidth={fullWidth}
      disabled={disabled}
      animation={animation}
      as={as}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      customClassName={className}
      {...rest}
    >
      {hasAnimationContent
        ? (
            <AnimationContent
              iconLeft={iconLeft}
              iconRight={iconRight}
              iconOnly={iconOnly}
              animation={animation}
              size={size}
              fullWidth={fullWidth}
              variant={variant}
            >
              {children}
            </AnimationContent>
          )
        : (
            <>
              {iconLeft && (
                <IconLeft fullWidth={fullWidth} iconLeft={iconLeft} size={size} />
              )}
              {children}
              {iconRight && (
                <IconRight
                  fullWidth={fullWidth}
                  iconRight={iconRight}
                  size={size}
                />
              )}
              {iconOnly}
            </>
          )}
      {!hasCustomHoverClasses && <Hover isHover={isHover} variant={variant} />}
    </ButtonComponent>
  );
};

export default Button;
