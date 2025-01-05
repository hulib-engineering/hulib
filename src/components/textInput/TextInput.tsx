import type { InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';

import type { ColorProps } from '@/components/private/types';
import { Size } from '@/components/private/types';

import TextInputBasic from './private/TextInputBasic';
import TextInputInnerLabel from './private/TextInputInnerLabel';
import TextInputPassword from './private/TextInputPassword';
import type { TextInputSizeType, TextInputTypes } from './private/types';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  inputSize?: TextInputSizeType | undefined;
  type: TextInputTypes | string;
  label?: ReactNode;
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

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { inputSize = Size.MEDIUM, type } = props;

  // render input with show/hide password
  if (type === 'password') {
    return <TextInputPassword {...props} ref={ref} />;
  }

  if (inputSize === Size.LARGE) {
    return <TextInputInnerLabel {...props} ref={ref} />;
  }
  // render rest sizes
  return <TextInputBasic {...props} ref={ref} />;
});
TextInput.displayName = 'TextInput';

export default TextInput;
