type LoaderSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

type LoaderProps = {
  color?: string;
  size?: LoaderSize;
  ariaLabel?: string;
};

export type { LoaderProps, LoaderSize };
