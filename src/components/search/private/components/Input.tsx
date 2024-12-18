import { MagnifyingGlass } from '@phosphor-icons/react';
import type { ComponentProps, HTMLAttributes, LegacyRef, Ref } from 'react';
import React, { forwardRef, useContext } from 'react';

import { mergeClassnames } from '@/components/private/utils';

import { SearchContext } from '../utils/context';

const Wrapper = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={mergeClassnames(
      'flex items-center px-2 gap-2 moon-search-input',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

const Icon = ({
  className,
  ...props
}: ComponentProps<typeof MagnifyingGlass>) => (
  <div>
    <MagnifyingGlass
      className={mergeClassnames(
        'pointer-events-none text-bulma text-moon-24',
        className,
      )}
      {...props}
    />
  </div>
);

const InnerInput = forwardRef(
  (
    {
      placeholder,
      className,
      ...props
    }: HTMLAttributes<HTMLInputElement> & { placeholder?: string },
    ref: Ref<HTMLInputElement>,
  ) => {
    const { search, onChangeOpen, onChangeSearch, inputRef } =
      useContext(SearchContext);
    const ariaLabelValue = props['aria-label'] ? props['aria-label'] : 'Search';
    return (
      <input
        ref={(ref || inputRef) as LegacyRef<HTMLInputElement>}
        spellCheck={false}
        className={mergeClassnames(
          'moon-search-input py-2 px-0 border-0 w-full focus:outline-none focus:border-0',
          'focus:ring-0 bg-transparent placeholder-bulma text-bulma text-moon-14',
          className,
        )}
        onClick={() => {
          onChangeOpen(true);
        }}
        onChange={(e) => {
          onChangeSearch(e.currentTarget.value);
        }}
        onFocus={(e) => {
          e.currentTarget.select();
          onChangeOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && search) {
            e.preventDefault();
            e.stopPropagation();
            onChangeSearch('');
          }
        }}
        placeholder={placeholder}
        value={search}
        type="text"
        autoComplete="off"
        aria-label={ariaLabelValue}
        {...props}
      />
    );
  },
);
InnerInput.displayName = 'InnerInput';

export const ButtonClear = ({
  children,
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) => {
  const { onChangeSearch } = useContext(SearchContext);
  return (
    <button
      tabIndex={-1}
      type="button"
      className={mergeClassnames(
        'cursor-pointer text-trunks text-moon-14 transition transform',
        className,
      )}
      onClick={(e) => {
        onChangeSearch('');
        const inputElement = e.currentTarget.parentNode?.querySelectorAll(
          '.moon-search-input',
        )[0] as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
        }
        if (typeof onClick === 'function') {
          onClick(e);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = Object.assign(Wrapper, {
  Icon,
  Input: InnerInput,
  ButtonClear,
});
