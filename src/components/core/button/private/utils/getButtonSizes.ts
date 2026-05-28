import type { ButtonSettingsProps } from '@/components/core/button/private/types';
import type { IconButtonSizes } from '@/components/core/iconButton/private/types';
import type { LoaderSize } from '@/components/core/loader/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const getSmPadding = ({
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (fullWidth) {
    return 'px-3';
  }
  if (icon === 'left' || iconLeft) {
    return 'ps-1 pe-2';
  }
  if (icon === 'right' || iconRight) {
    return 'ps-2 pe-1';
  }
  if (icon === 'only' || iconOnly) {
    return 'px-1';
  }
  return 'px-3';
};

const getLgPadding = ({
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (fullWidth) {
    return 'px-4';
  }
  if (icon === 'left' || iconLeft) {
    return 'ps-3 pe-4';
  }
  if (icon === 'right' || iconRight) {
    return 'ps-4 pe-3';
  }
  if (icon === 'only' || iconOnly) {
    return 'px-3';
  }
  return 'px-4';
};

export const getButtonSizes = ({
  size,
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (size === 'sm') {
    return mergeClassnames(
      getSmPadding({
        icon,
        iconLeft,
        iconRight,
        iconOnly,
        fullWidth,
      }),
      'h-8 py-2 gap-1.5 text-sm rounded-full',
    );
  }
  return mergeClassnames(
    getLgPadding({ icon, iconLeft, iconRight, iconOnly, fullWidth }),
    'h-11 py-3 gap-2 rounded-full',
  );
};

export const getIconSize = (size?: IconButtonSizes): string => {
  if (size === 'sm') {
    return 'text-base';
  }
  return 'text-xl';
};

export const getLoaderSize = (size?: IconButtonSizes): LoaderSize => {
  if (size === 'sm') {
    return '2xs';
  }
  return 'xs';
};
