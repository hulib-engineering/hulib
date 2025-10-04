import { Eye, EyeSlash } from '@phosphor-icons/react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef, useState } from 'react';

import type { TextInputSizeType, TextInputTypes } from './types';
import Hint from '@/components/Hint';
import IconButton from '@/components/core/iconButton/IconButton';
import Input from '@/components/core/input/Input';
import Label from '@/components/Label';
import type { ColorProps } from '@/components/core/private/types';
import { Size } from '@/components/core/private/types';
import Container from '@/components/core/textInput/styles/Container';
import Inner from '@/components/core/textInput/styles/Inner';
import LabelInner from '@/components/core/textInput/styles/LabelInner';
import ShowPassword from '@/components/core/textInput/styles/ShowPassword';

type TextInputPasswordProps = {
  id?: string;
  inputSize?: TextInputSizeType | string;
  label?: ReactNode;
  type: TextInputTypes | string;
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

const TextInputPassword = forwardRef<HTMLInputElement, TextInputPasswordProps>(
  (props, ref) => {
    const {
      id,
      inputSize = Size.MEDIUM,
      disabled,
      placeholder = ' ',
      label,
      hintText,
      isError,
      dir,
      showPasswordText,
      isSharpLeftSide,
      isSharpRightSide,
      isSharpTopSide,
      isSharpBottomSide,
      isTopBottomBorderHidden,
      isSideBorderHidden,
      backgroundColor = 'gohan',
      ...rest
    } = props;

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordShown(!passwordShown);
    };

    const inputProps = {
      placeholder,
      dir,
      isTopBottomBorderHidden,
      isSideBorderHidden,
      ...rest,
    };

    const containerProps = {
      disabled,
      isSharpLeftSide,
      isSharpRightSide,
      isSharpTopSide,
      isSharpBottomSide,
    };

    if (inputSize === Size.LARGE) {
      return (
        <Container {...containerProps}>
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
              type={passwordShown ? 'text' : 'password'}
            />
            <LabelInner isRtl={dir === 'rtl'}>{label}</LabelInner>
            <ShowPassword
              onClick={togglePasswordVisibility}
              isRtl={dir === 'rtl'}
            >
              {showPasswordText}
            </ShowPassword>
          </Inner>
          {hintText && <Hint error={isError}>{hintText}</Hint>}
        </Container>
      );
    }
    return (
      <Container {...containerProps}>
        {label && (
          <Label dir={dir} htmlFor={id}>
            {label}
          </Label>
        )}
        <Inner>
          <Input
            // @ts-ignore
            size={inputSize}
            error={isError}
            ref={ref}
            id={id}
            isPassword
            bgColor={backgroundColor}
            {...inputProps}
            {...containerProps}
            type={passwordShown ? 'text' : 'password'}
          />
          <IconButton
            onClick={togglePasswordVisibility}
            icon={!passwordShown ? <Eye /> : <EyeSlash />}
            variant="ghost"
            className="absolute right-0 top-1/3 z-[3] mt-[-12px] cursor-pointer"
            data-testid="button"
          />
        </Inner>
        {hintText && <Hint error={isError}>{hintText}</Hint>}
      </Container>
    );
  },
);
TextInputPassword.displayName = 'TextInputPassword';

export default TextInputPassword;
