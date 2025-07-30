import React, { forwardRef } from 'react';

import Container from './Container';
import HintText from './HintText';
import Input from './Input';
import type TextInputProps from './types';
import { getBorderRadius } from './utils';
import { mergeClassnames } from '@/components/private/utils';

const TextInputInnerLabel = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    const {
      id,
      inputSize,
      type,
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
    const inputProps = {
      disabled,
      type,
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
    return (
      <Container inputSize={inputSize}>
        <div
          className={mergeClassnames(
            'w-full max-w-full relative',
            bgColor || 'bg-transparent',
            getBorderRadius(inputSize),
          )}
        >
          <Input
            inputSize={inputSize}
            isError={isError}
            ref={ref}
            id={id}
            isLabel={!!label}
            isRtl={dir === 'rtl'}
            {...inputProps}
          />
          <label
            htmlFor={id}
            className="absolute start-4 top-3 z-[1] text-sm text-neutral-10 transition-all duration-200 ease-in-out"
          >
            {label}
          </label>
        </div>
        {hintText && <HintText isError={isError}>{hintText}</HintText>}
      </Container>
    );
  },
);
TextInputInnerLabel.displayName = 'TextInputInnerLabel';

export default TextInputInnerLabel;
