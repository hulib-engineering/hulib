import type { TextAreaProps } from './types';

export const getSizeStyles = (size?: TextAreaProps['size']): string => {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-lg';
    case 'md':
    default:
      return 'text-base';
  }
};
