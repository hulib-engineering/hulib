import type { AvatarProps, StatusProps } from './private/types';
import Wrapper from './styles/Wrapper';
import { getStatusSize } from './private/utils';

import { mergeClassnames } from '@/components/private/utils';

const AvatarRoot = ({
  imageUrl,
  children,
  size = 'md',
  className,
}: AvatarProps) => {
  return (
    <Wrapper
      size={size}
      imageUrl={imageUrl}
      className={mergeClassnames(getStatusSize(size), className)}
    >
      {children && children}
    </Wrapper>
  );
};

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
