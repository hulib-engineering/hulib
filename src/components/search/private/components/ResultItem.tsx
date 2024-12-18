import Link from 'next/link';
import React, { useContext } from 'react';

import { mergeClassnames } from '@/components/private/utils';

import type { ButtonProps, LinkProps } from '../types';
import { OpenContext, SelectContext } from '../utils/context';

const commonClasses = 'moon-search-list-item w-full';

export const CustomLink = ({
  closeOnSelect = true,
  disabled = false,
  className,
  children,
  // onClick,
  index,
  ...rest
}: LinkProps) => {
  // const { onChangeOpen } = useContext(OpenContext);
  const { selected } = useContext(SelectContext);

  function renderLinkContent() {
    return (
      <div>
        {typeof children === 'function'
          ? children(selected === index)
          : children}
      </div>
    );
  }

  // function clickAndClose(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  //   if (rest.href && !disabled) {
  //     if (onClick) {
  //       onClick(e);
  //     }
  //
  //     if (closeOnSelect) {
  //       onChangeOpen(false);
  //     }
  //   }
  // }

  return (
    // @ts-ignore
    <Link
      data-close-on-select={closeOnSelect}
      aria-disabled={disabled}
      // onClick={clickAndClose}
      className={mergeClassnames(commonClasses, className)}
      {...rest}
    >
      {renderLinkContent()}
    </Link>
  );
};

export const Button = ({
  closeOnSelect = true,
  className,
  children,
  onClick,
  index,
  ...rest
}: ButtonProps) => {
  const { selected } = useContext(SelectContext);
  const { onChangeOpen } = useContext(OpenContext);

  function clickAndClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (onClick) {
      onClick(e);

      if (closeOnSelect) {
        onChangeOpen(false);
      }
    }
  }

  return (
    <button
      {...rest}
      aria-disabled={rest.disabled ?? false}
      data-close-on-select={closeOnSelect}
      type="button"
      onClick={clickAndClose}
      className={mergeClassnames(commonClasses, className)}
    >
      {typeof children === 'function' ? children(selected === index) : children}
    </button>
  );
};

const ResultItem = (props: ButtonProps & LinkProps) => {
  const Wrapper = props.href ? CustomLink : Button;

  return <Wrapper {...props} />;
};

export default ResultItem;
