import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import Hint from '@/components/Hint';
import Input from '@/components/input/Input';
import type { ColorProps } from '@/components/private/types';
import { Size } from '@/components/private/types';

import Container from '../styles/Container';
import Inner from '../styles/Inner';
import LabelInner from '../styles/LabelInner';
import type { TextInputSizeType, TextInputTypes } from './types';

interface TextInputMediumProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  inputSize?: TextInputSizeType | undefined;
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
}
const TextInputInnerLabel = forwardRef<HTMLInputElement, TextInputMediumProps>(
  (props, ref) => {
    const {
      id,
      inputSize = Size.MEDIUM,
      type,
      disabled,
      placeholder = ' ',
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
        <Inner bgColor={backgroundColor}>
          <Input
            // @ts-ignore
            size={inputSize}
            error={isError}
            ref={ref}
            id={id}
            isLabel={!!label}
            isRtl={dir === 'rtl'}
            {...inputProps}
            {...containerProps}
          />
          <LabelInner isRtl={dir === 'rtl'}>{label}</LabelInner>
        </Inner>
        {hintText && <Hint error={isError}>{hintText}</Hint>}
      </Container>
    );
  },
);
TextInputInnerLabel.displayName = 'TextInputInnerLabel';

export default TextInputInnerLabel;
