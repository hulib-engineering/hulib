import { getWrapperSize } from '../private/utils';

import type { AvatarProps } from '@/components/core/avatar/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const Wrapper = ({
  size,
  imageUrl,
  children,
  className,
}: AvatarProps) => (
  <div className="relative inline-flex items-center justify-center">
    <div
      className={mergeClassnames(
        'rounded-full overflow-hidden flex items-center justify-center bg-cover',
        getWrapperSize(size),
        className,
      )}
      style={{ backgroundImage: `url('${imageUrl || '/assets/images/ava-placeholder.png'}')` }}
    >
      {children}
    </div>
  </div>
);

export default Wrapper;
