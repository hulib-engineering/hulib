import type { WithChildren } from '@/components/private/types';

type SizeProps = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type StatusOriginProps = {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right';
};

type AvatarProps = WithChildren<{
  imageUrl?: string;
  size?: SizeProps;
  className?: string;
}>;

type StatusProps = {
  position?: StatusOriginProps;
  className?: string;
};

export type { AvatarProps, SizeProps, StatusProps };
