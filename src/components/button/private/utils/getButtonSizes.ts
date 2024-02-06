import type {
  ButtonSettingsProps,
  ButtonSizes,
} from '@/components/button/private/types';
import type { LoaderSize } from '@/components/loader/private/types';
import { mergeClassnames } from '@/components/private/utils';

const getXsPadding = ({
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (fullWidth) {
    return 'px-2';
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
  return 'px-2';
};

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
    return 'ps-1 pe-3';
  }
  if (icon === 'right' || iconRight) {
    return 'ps-3 pe-1';
  }
  if (icon === 'only' || iconOnly) {
    return 'px-1';
  }
  return 'px-3';
};

const getMdPadding = ({
  icon,
  // iconLeft,
  // iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (fullWidth) {
    return 'px-4';
  }
  // if (icon === 'left' || iconLeft) {
  //   return 'ps-2 pe-4';
  // }
  // if (icon === 'right' || iconRight) {
  //   return 'ps-4 pe-2';
  // }
  if (icon === 'only' || iconOnly) {
    return 'px-2';
  }
  return 'px-4';
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

const getXlPadding = ({
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (fullWidth) {
    return 'px-6';
  }
  if (icon === 'left' || iconLeft) {
    return 'ps-4 pe-6';
  }
  if (icon === 'right' || iconRight) {
    return 'ps-6 pe-4';
  }
  if (icon === 'only' || iconOnly) {
    return 'px-4';
  }
  return 'px-6';
};

export const getButtonSizes = ({
  size,
  icon,
  iconLeft,
  iconRight,
  iconOnly,
  fullWidth,
}: ButtonSettingsProps): string => {
  if (size === 'xs') {
    return mergeClassnames(
      getXsPadding({
        icon,
        iconLeft,
        iconRight,
        iconOnly,
        fullWidth,
      }),
      'h-6 py-1 gap-1 text-moon-12 rounded',
    );
  }
  if (size === 'sm') {
    return mergeClassnames(
      getSmPadding({
        icon,
        iconLeft,
        iconRight,
        iconOnly,
        fullWidth,
      }),
      'h-8 py-1 gap-1 text-moon-14 rounded-lg',
    );
  }
  if (size === 'lg') {
    return mergeClassnames(
      getLgPadding({
        icon,
        iconLeft,
        iconRight,
        iconOnly,
        fullWidth,
      }),
      'h-12 py-3 gap-2 text-moon-16 rounded-lg',
    );
  }
  if (size === 'xl') {
    return mergeClassnames(
      getXlPadding({
        icon,
        iconLeft,
        iconRight,
        iconOnly,
        fullWidth,
      }),
      'h-14 py-4 gap-2 text-moon-16 rounded-xl',
    );
  }
  return mergeClassnames(
    getMdPadding({ icon, iconLeft, iconRight, iconOnly, fullWidth }),
    'py-2 gap-2 text-moon-14 rounded-lg',
  );
};

export const getIconSize = (size?: ButtonSizes): string => {
  if (size === 'xs') {
    return 'text-moon-16';
  }
  return 'text-moon-24';
};

export const getLoaderSize = (size?: ButtonSizes): LoaderSize => {
  if (size === 'xs') {
    return '2xs';
  }
  return 'xs';
};
