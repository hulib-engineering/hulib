import type { ChipProps } from './type';

const getActive = ({
  isActive,
  isStroke,
}: Pick<ChipProps, 'isActive' | 'isStroke'>): string =>
  isStroke && isActive
    ? 'shadow-interactive bg-primary-98 text-primary-50'
    : isActive
      ? 'bg-primary-98 text-primary-50'
      : 'text-neutral-20';

const getDisabled = ({
  disabled,
  isStroke,
}: Pick<ChipProps, 'disabled' | 'isStroke'>): string =>
  disabled
    ? 'opacity-60 cursor-not-allowed'
    : isStroke
      ? 'hover:shadow-interactive hover:text-primary-50 hover:bg-primary-98'
      : 'hover:text-primary-50 hover:bg-primary-98';

const getPadding = ({
  size,
  iconLeft,
  iconRight,
  iconOnly,
}: ChipProps): string => {
  if (size === 'sm') {
    if (iconLeft && !iconRight) {
      return 'py-1 ps-1 pe-2';
    }
    if (iconRight && !iconLeft) {
      return 'py-1 ps-2 pe-1';
    }
    if (!iconRight && !iconLeft && !iconOnly) {
      return 'py-1 px-2';
    }
    return 'p-1';
  }
  if (iconLeft && !iconRight) {
    return 'py-2 ps-2 pe-3';
  }
  if (iconRight && !iconLeft) {
    return 'py-2 ps-3 pe-2';
  }
  if (!iconRight && !iconLeft && !iconOnly) {
    return 'py-2 px-3';
  }
  return 'p-2';
};

export { getActive, getDisabled, getPadding };
