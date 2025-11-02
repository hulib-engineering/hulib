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
  children,
  className,
}: StatusProps) => (
  <div
    className={mergeClassnames(
      'absolute',
      position && position.vertical === 'top' && '-top-1.5',
      position && position.vertical === 'bottom' && '-bottom-1.5',
      position && position.horizontal === 'left' && '-start-1.5',
      position && position.horizontal === 'right' && '-end-1.5',
      className,
    )}
  >
    {children}
  </div>
);

const Avatar = Object.assign(AvatarRoot, { Status });

export default Avatar;
