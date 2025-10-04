import { getWrapperSize } from '../private/utils';

import type { AvatarProps } from '@/components/core/avatar/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const Wrapper = ({
  size,
  imageUrl,
  children,
  className,
}: AvatarProps) => (
  <div
    className={mergeClassnames(
      'relative rounded-full overflow-hidden flex items-center justify-center bg-cover',
      getWrapperSize(size),
      className,
    )}
    style={{ backgroundImage: `url('${imageUrl || '/assets/images/ava-placeholder.png'}')` }}
  >
    {children}
  </div>
);

export default Wrapper;
