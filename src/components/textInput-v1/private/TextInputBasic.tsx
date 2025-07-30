import React, { forwardRef } from 'react';

import Container from './Container';
import HintText from './HintText';
import Input from './Input';
import type TextInputProps from './types';
import { getLabelSize } from './utils';
import { mergeClassnames } from '@/components/private/utils';

const TextInputBasic = forwardRef<HTMLInputElement, TextInputProps>(
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
      required = false,
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
      required,
      ...rest,
    };
    return (
      <Container>
        {label && (
          <label
            dir={dir}
            htmlFor={id}
            className={mergeClassnames(
              'w-full block pb-2 text-neutral-10 leading-4',
              getLabelSize(inputSize),
            )}
          >
            {label}
            {required && <span className="text-red-50">*</span>}
          </label>
        )}
        <Input
          inputSize={inputSize}
          isError={isError}
          ref={ref}
          id={id}
          bgColor={bgColor}
          isRtl={dir === 'rtl'}
          {...inputProps}
        />
        {hintText && <HintText isError={isError}>{hintText}</HintText>}
      </Container>
    );
  },
);
TextInputBasic.displayName = 'TextInputBasic';

export default TextInputBasic;
