import NiceAvatar, { genConfig } from 'react-nice-avatar';
import { getWrapperSize } from '../private/utils';

import type { AvatarProps } from '@/components/core/avatar/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const defaultConfig = genConfig('default-avatar');

const Wrapper = ({
  size,
  imageUrl,
  children,
  className,
}: AvatarProps) => (
  <div className="relative inline-flex items-center justify-center">
    <div
      className={mergeClassnames(
        'rounded-full overflow-hidden flex items-center justify-center',
        imageUrl && 'bg-cover bg-center bg-no-repeat',
        getWrapperSize(size),
        className,
      )}
      style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
    >
      {!imageUrl && (
        <NiceAvatar className="size-full" {...defaultConfig} />
      )}
      {children}
    </div>
  </div>
);

export default Wrapper;
