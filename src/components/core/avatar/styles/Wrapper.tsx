import NiceAvatar, { genConfig } from 'react-nice-avatar';
import { getWrapperSize } from '../private/utils';

import type { AvatarProps } from '@/components/core/avatar/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const Wrapper = ({
  size,
  imageUrl,
  name,
  children,
  className,
}: AvatarProps) => {
  const wrapperClassName = mergeClassnames(
    'rounded-full overflow-hidden flex items-center justify-center bg-cover',
    getWrapperSize(size),
    className,
  );

  return (
    <div className="relative inline-flex items-center justify-center">
      {imageUrl
        ? (
            <div
              className={wrapperClassName}
              style={{ backgroundImage: `url('${imageUrl}')` }}
            >
              {children}
            </div>
          )
        : (
            <div className={wrapperClassName}>
              <NiceAvatar
                className="size-full"
                {...genConfig(name || 'user')}
              />
              {children}
            </div>
          )}
    </div>
  );
};

export default Wrapper;
