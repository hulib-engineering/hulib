import { Eye, EyeSlash } from '@phosphor-icons/react';
import React, { forwardRef, useState } from 'react';

import Container from './Container';
import HintText from './HintText';
import Input from './Input';
import type TextInputProps from './types';
import { getBorderRadius, getLabelSize } from './utils';
import { mergeClassnames } from '@/components/core/private/utils';
import IconButton from '@/components/core/iconButton/IconButton';

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
      setPasswordShown(prevState => !prevState);
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
        <Container>
          <div
            className={mergeClassnames(
              'w-full max-w-full relative',
              getBorderRadius(inputSize),
              bgColor && bgColor,
            )}
          >
            <Input
              {...inputProps}
              inputSize={inputSize}
              isError={isError}
              ref={ref}
              id={id}
              isLabel={!!label}
              type={passwordShown ? 'text' : 'password'}
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
      <Container>
        {label && (
          <label
            dir={dir}
            htmlFor={id}
            className={mergeClassnames(
              'block text-neutral-10 pb-2',
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
            {...inputProps}
            inputSize={inputSize}
            isError={isError}
            ref={ref}
            id={id}
            bgColor={bgColor}
            type={passwordShown ? 'text' : 'password'}
          />
          {passwordShown ? (
            <EyeSlash
              className="absolute end-4 top-2/4 z-[3] -mt-3 cursor-pointer text-2xl"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <Eye
              className="absolute end-4 top-2/4 z-[3] -mt-3 cursor-pointer text-2xl"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
        {hintText && <HintText isError={isError}>{hintText}</HintText>}
      </Container>
    );
  },
);
TextInputPassword.displayName = 'TextInputPasswordV1';

export default TextInputPassword;
