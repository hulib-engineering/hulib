import type { AvatarProps, StatusProps } from './private/types';
import { getStatusSize } from './private/utils';
import Wrapper from './styles/Wrapper';
import { mergeClassnames } from '@/components/core/private/utils';

const AvatarRoot = ({
  imageUrl,
  children,
  size = 'md',
  className,
}: AvatarProps) => (
  <Wrapper
    size={size}
    imageUrl={imageUrl}
    className={mergeClassnames(getStatusSize(size), className)}
  >
    {children && children}
  </Wrapper>
);

const Status = ({
  position = { vertical: 'bottom', horizontal: 'right' },
  className,
}: StatusProps) => (
  <div
    className={mergeClassnames(
      'status',
      'absolute border-solid border-gohan rounded-full bg-roshi',
      position && position.vertical === 'top' && 'top-0',
      position && position.vertical === 'bottom' && 'bottom-0',
      position && position.horizontal === 'left' && 'start-0',
      position && position.horizontal === 'right' && 'end-0',
      className,
    )}
  />
);

const Avatar = Object.assign(AvatarRoot, { Status });

export default Avatar;
