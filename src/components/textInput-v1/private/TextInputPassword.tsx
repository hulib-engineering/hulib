import { Eye, EyeSlash } from '@phosphor-icons/react';
import React, { forwardRef, useState } from 'react';

import IconButton from '@/components/iconButton/IconButton';
import { mergeClassnames } from '@/components/private/utils';

import Container from './Container';
import HintText from './HintText';
import Input from './Input';
import type TextInputProps from './types';
import { getBorderRadius, getLabelSize } from './utils';

const TextInputPassword = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      id,
      inputSize,
      disabled,
      placeholder,
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
      bgColor = 'bg-goku',
      ...rest
    } = props;

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordShown(!passwordShown);
    };

    const inputProps = {
      disabled,
      placeholder,
      dir,
      isSharpLeftSide,
      isSharpRightSide,
      isSharpTopSide,
      isSharpBottomSide,
      isTopBottomBorderHidden,
      isSideBorderHidden,
      ...rest,
    };

    if (inputSize === 'xl') {
      return (
        <Container disabled={disabled}>
          <div
            className={mergeClassnames(
              'w-full max-w-full relative',
              getBorderRadius(inputSize),
              bgColor && bgColor,
            )}
          >
            <Input
              inputSize={inputSize}
              type={passwordShown ? 'text' : 'password'}
              isError={isError}
              ref={ref}
              id={id}
              isLabel={!!label}
              isPassword
              {...inputProps}
            />
            <label
              htmlFor={id}
              className="absolute start-4 top-3 z-[1] text-neutral-10 transition-all"
            >
              {label}
            </label>
            <IconButton
              onClick={togglePasswordVisibility}
              icon={!passwordShown ? <Eye /> : <EyeSlash />}
              variant="ghost"
              className="absolute right-0 top-1/3 z-[3] mt-[-12px] cursor-pointer"
              data-testid="button"
            />
          </div>
          {hintText && <HintText isError={isError}>{hintText}</HintText>}
        </Container>
      );
    }
    return (
      <Container disabled={disabled}>
        {label && (
          <label
            dir={dir}
            htmlFor={id}
            className={mergeClassnames(
              'block text-bulma pb-2',
              getLabelSize(inputSize),
            )}
          >
            {label}
          </label>
        )}
        <div
          className={mergeClassnames(
            'w-full max-w-full relative',
            getBorderRadius(inputSize),
          )}
        >
          <Input
            inputSize={inputSize}
            type={passwordShown ? 'text' : 'password'}
            isError={isError}
            ref={ref}
            id={id}
            bgColor={bgColor}
            isPassword
            {...inputProps}
          />
          <IconButton
            onClick={togglePasswordVisibility}
            icon={!passwordShown ? <Eye /> : <EyeSlash />}
            variant="ghost"
            className="absolute right-0 top-1/3 z-[3] mt-[-12px] cursor-pointer"
            data-testid="button"
          />
        </div>
        {hintText && <HintText isError={isError}>{hintText}</HintText>}
      </Container>
    );
  },
);
TextInputPassword.displayName = 'TextInputPassword';

export default TextInputPassword;
