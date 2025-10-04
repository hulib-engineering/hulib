import type { ElementType, ReactNode } from 'react';
import React, { forwardRef, useEffect, useMemo } from 'react';

import { CheckSquare, Square } from '@phosphor-icons/react';
import type { CheckboxRadioProps, MenuItemPolymorphicProps } from './private/types';
import { MenuItemContext, useMenuItemContext } from './private/utils';
import type { PolymorphicRef } from '@/components/core/private/types';
import { mergeClassnames, useRegisterChild } from '@/components/core/private/utils';

const MenuItemRoot = forwardRef(
  // @ts-ignore
  <C extends ElementType = 'button'>(
    {
      as,
      children,
      width,
      isSelected,
      isActive,
      isDisabled,
      className,
      ...rest
    }: MenuItemPolymorphicProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    console.log('MenuItemRoot', isSelected, children);
    const Component = as || 'button';

    const { items, register } = useRegisterChild();

    const contextValue = useMemo(
      () => ({ states: {
        selected: isSelected,
        active: isActive,
        disabled: isDisabled,
      }, registerChild: register }),
      [isSelected, isActive, isDisabled, register],
    );

    console.log('Items', items);
    const isNoBg = items?.find(
      (name: string) => name === 'Radio' || name === 'Checkbox',
    );
    const innerSelected = isNoBg ? false : isSelected;

    return (
      <MenuItemContext.Provider value={contextValue}>
        <Component
          ref={ref}
          className={mergeClassnames(
            'flex gap-2 items-center p-2 bg-transparent rounded-lg transition-colors',
            'text-sm text-neutral-10 focus:outline-none focus:shadow-focus cursor-pointer',
            'hover:bg-primary-98',
            width || 'w-full',
            (innerSelected || isActive) && 'bg-primary-90 text-primary-60',
            isDisabled && 'text-neutral-70',
            className && className,
          )}
          disabled={isDisabled}
          {...((!as || as === 'button') && { type: 'button' })}
          {...rest}
        >
          {children}
        </Component>
      </MenuItemContext.Provider>
    );
  },
);

MenuItemRoot.displayName = 'MenuItemRoot';

const Title = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  const { registerChild } = useMenuItemContext('ModalItem.Title');

  useEffect(() => {
    if (registerChild) {
      registerChild('Title');
    }
  }, []);

  return (
    <span
      className={mergeClassnames(
        'block grow overflow-hidden text-left text-neutral-20',
        className && className,
      )}
    >
      {children}
    </span>
  );
};

const Checkbox = ({
  isSelected,
  className,
  'aria-label': ariaLabel,
}: CheckboxRadioProps) => {
  const { selected = isSelected, registerChild }
    = useMenuItemContext('MenuItem.Checkbox');

  useEffect(() => {
    if (registerChild) {
      registerChild('Checkbox');
    }
  }, []);

  const ariaLabelValue = ariaLabel || 'Checkbox';

  return (
    <span className="relative flex size-5 items-center justify-center">
      <span
        role="checkbox"
        aria-checked={selected}
        aria-label={ariaLabelValue}
        className={mergeClassnames(
          'absolute inset-0 flex size-5 items-center justify-center',
          'transition-colors text-[16px]',
          className,
        )}
      >
        {selected
          ? (
              <CheckSquare
                weight="fill"
                className={mergeClassnames(
                  'transition-colors text-primary-50',
                  selected ? 'opacity-100' : 'opacity-0',
                )}
              />
            ) : (
              <Square
                weight="bold"
                className={mergeClassnames(
                  'transition-opacity text-neutral-40',
                  selected ? 'opacity-0' : 'opacity-100',
                )}
              />
            )}
        {/* <Check */}
        {/*  className={mergeClassnames( */}
        {/*    'transition-opacity', */}
        {/*    selected ? 'opacity-100' : 'opacity-0', */}
        {/*  )} */}
        {/* /> */}
      </span>
    </span>
  );
};

const MenuItem = Object.assign(MenuItemRoot, {
  Title,
  Checkbox,
});

export default MenuItem;
