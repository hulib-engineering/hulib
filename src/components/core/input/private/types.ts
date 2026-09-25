import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

type InputProps = {
  className?: string;
  type?: HTMLInputTypeAttribute;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  id?: string;
  // Styling flags passed down by the textInput wrappers. They must all be
  // destructured in Input.tsx — anything left in `...rest` is spread onto the
  // native <input> and React warns about an unknown DOM attribute.
  bgColor?: string;
  isRtl?: boolean;
  isLabel?: boolean;
  isPassword?: boolean;
  isFirst?: boolean;
  isSharpLeftSide?: boolean;
  isSharpRightSide?: boolean;
  isSharpTopSide?: boolean;
  isSharpBottomSide?: boolean;
  isTopBottomBorderHidden?: boolean;
  isSideBorderHidden?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export default InputProps;
