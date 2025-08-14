import type { SizeProps } from '@/components/avatar/private/types';

const getWrapperSize = (size?: SizeProps) => {
  if (size === 'xs') {
    return 'h-6 w-6';
  }
  if (size === 'sm') {
    return 'h-8 w-8';
  }
  if (size === 'md') {
    return 'h-10 w-10';
  }
  if (size === 'lg') {
    return 'h-12 w-12';
  }
  if (size === 'xl') {
    return 'h-14 w-14';
  }
  return 'h-16 w-16';
};

const getStatusSize = (size?: SizeProps) => {
  if (size === 'xs') {
    return '[&_.status]:w-2 [&_.status]:h-2 [&_.status]:border';
  }
  if (size === 'sm' || size === 'md') {
    return '[&_.status]:w-3 [&_.status]:h-3 [&_.status]:border-2';
  }
  return '[&_.status]:w-4 [&_.status]:h-4 [&_.status]:border-2';
};

export { getWrapperSize, getStatusSize };
