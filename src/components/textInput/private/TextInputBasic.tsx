import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import Container from '../styles/Container';
import Hint from '@/components/Hint';
import Input from '@/components/input/Input';
import Label from '@/components/Label';
import type { ColorProps } from '@/components/private/types';
import { Size } from '@/components/private/types';
import { mergeClassnames } from '@/components/private/utils';
import type {
  TextInputSizeType,
  TextInputTypes,
} from '@/components/textInput/private/types';
import Inner from '@/components/textInput/styles/Inner';

type TextInputXSandSmProps = {
  id?: string;
  inputSize?: TextInputSizeType;
  label?: ReactNode;
  type: TextInputTypes | string;
  icon?: ReactNode;
  placeholder?: string;
  hintText?: ReactNode;
  isError?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
  showPasswordText?: ReactNode;
  backgroundColor?: ColorProps;
  isSharpLeftSide?: boolean;
  isSharpRightSide?: boolean;
  isSharpTopSide?: boolean;
  isSharpBottomSide?: boolean;
  isTopBottomBorderHidden?: boolean;
  isSideBorderHidden?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInputBasic = forwardRef<HTMLInputElement, TextInputXSandSmProps>(
  (props, ref) => {
    const {
      id,
      inputSize = Size.MEDIUM,
      type,
      disabled,
      placeholder = ' ',
      icon,
      label,
      hintText,
      isError,
      dir,
      isSharpLeftSide,
      isSharpRightSide,
      isSharpTopSide,
      isSharpBottomSide,
      isTopBottomBorderHidden,
      isSideBorderHidden,
      backgroundColor = '#F9F9F9',
      ...rest
    } = props;
    const inputProps = {
      type,
      placeholder,
      dir,
      isTopBottomBorderHidden,
      isSideBorderHidden,
      bgColor: backgroundColor,
      ...rest,
    };
    const containerProps = {
      disabled,
      isSharpLeftSide,
      isSharpRightSide,
      isSharpTopSide,
      isSharpBottomSide,
    };

    return (
      <Container {...containerProps}>
        {label && (
          <Label dir={dir} htmlFor={id}>
            {label}
          </Label>
        )}
        {icon ? (
          <Inner
            bgColor={backgroundColor}
            className={mergeClassnames(
              'flex items-center !rounded-2xl border border-neutral-90 px-3 py-0.5',
              'focus-within:border-2 focus-within:border-primary-50 focus-within:shadow-focus-input focus-within:bg-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-primary-50',
            )}
          >
            <Input
              // @ts-ignore
              size={inputSize}
              error={isError}
              ref={ref}
              id={id}
              isLabel={!!label}
              isPassword
              {...inputProps}
              {...containerProps}
              type={type}
              className="border-none focus:bg-white"
            />
            {icon}
          </Inner>
        ) : (
          <Input
            // @ts-ignore
            size={inputSize}
            error={isError}
            ref={ref}
            id={id}
            isRtl={dir === 'rtl'}
            {...inputProps}
            {...containerProps}
            type={type}
          />
        )}
        {hintText && <Hint error={isError}>{hintText}</Hint>}
      </Container>
    );
  },
);
TextInputBasic.displayName = 'TextInputBasic';

export default TextInputBasic;
