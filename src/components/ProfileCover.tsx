import type { ReactNode } from 'react';

import { mergeClassnames } from '@/components/core/private/utils';

type IProfileCoverProps = {
  imageUrl: string;
  children?: ReactNode;
  className?: string;
};

const ProfileCover = ({
  imageUrl,
  children,
  className,
}: IProfileCoverProps) => {
  return (
    <div
      className={mergeClassnames(
        'size-full relative flex items-center justify-center bg-cover',
        className,
      )}
      style={{ backgroundImage: imageUrl ? `url('${imageUrl}')` : 'url(\'/assets/images/default-cover.png\')' }}
    >
      {children}
    </div>
  );
};

export { ProfileCover };
