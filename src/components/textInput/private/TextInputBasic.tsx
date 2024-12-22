import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import Hint from '@/components/Hint';
import Input from '@/components/input/Input';
import Label from '@/components/Label';
import type { ColorProps } from '@/components/private/types';
import { Size } from '@/components/private/types';
import type {
  TextInputSizeType,
  TextInputTypes,
} from '@/components/textInput/private/types';
import Inner from '@/components/textInput/styles/Inner';

import Container from '../styles/Container';

interface TextInputXSandSmProps extends InputHTMLAttributes<HTMLInputElement> {
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
}

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
      backgroundColor = 'gohan',
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
          <Inner bgColor={backgroundColor}>
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
