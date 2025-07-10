import type { ElementType, ReactNode } from 'react';
import React, { forwardRef, useEffect } from 'react';

import type { PolymorphicRef } from '@/components/private/types';
import { mergeClassnames, useRegisterChild } from '@/components/private/utils';

import type { MenuItemPolymorphicProps } from './private/types';
import { MenuItemContext, useMenuItemContext } from './private/utils';

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
    const Component = as || 'button';
    const states = {
      selected: isSelected,
      active: isActive,
      disabled: isDisabled,
    };
    const { items, register } = useRegisterChild();
    const isNoBg = items?.find(
      (name: string) => name === 'Radio' || name === 'Checkbox',
    );
    const innerSelected = isNoBg ? false : isSelected;
    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <MenuItemContext.Provider value={{ ...states, registerChild: register }}>
        <Component
          ref={ref}
          className={mergeClassnames(
            'flex gap-2 justify-start items-center p-2 bg-transparent rounded-lg',
            'text-sm leading-4 text-neutral-20 focus:outline-none focus:shadow-focus cursor-pointer',
            'hover:bg-primary-98 hover:text-primary-20 transition',
            width || 'w-full',
            (innerSelected || isActive) && 'bg-primary-90 text-neutral-20',
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

const MenuItem = Object.assign(MenuItemRoot, {
  Title,
});

export default MenuItem;
