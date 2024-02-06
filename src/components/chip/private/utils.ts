import type { IChipProps } from '@/components/chip/Chip';

const getActive = ({
  isActive,
  isStroke,
}: Pick<IChipProps, 'isActive' | 'isStroke'>): string =>
  isStroke && isActive
    ? 'shadow-interactive bg-jiren text-piccolo'
    : isActive
      ? 'bg-jiren text-piccolo'
      : 'text-bulma';

const getDisabled = ({
  disabled,
  isStroke,
}: Pick<IChipProps, 'disabled' | 'isStroke'>): string =>
  disabled
    ? 'opacity-60 cursor-not-allowed'
    : isStroke
      ? 'hover:shadow-interactive hover:text-piccolo hover:bg-jiren'
      : 'hover:text-piccolo hover:bg-jiren';

const getPadding = ({
  size,
  iconLeft,
  iconRight,
  iconOnly,
}: IChipProps): string => {
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
