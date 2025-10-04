import type { SizeProps } from '@/components/core/avatar/private/types';

const getWrapperSize = (size?: SizeProps) => {
  if (size === 'xs') {
    return 'size-4';
  }
  if (size === 'sm') {
    return 'size-8';
  }
  if (size === 'md') {
    return 'size-10';
  }
  if (size === 'lg') {
    return 'size-12';
  }
  if (size === 'xl') {
    return 'size-14';
  }
  return 'size-16';
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
