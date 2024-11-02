import Image from 'next/image';
import React from 'react';

import IconButton from '@/components/iconButton/IconButton';
import { mergeClassnames } from '@/components/private/utils';

const SocialIcon = ({ iconUrl }: { iconUrl: string }) => (
  <Image
    src={iconUrl}
    alt="Social icon"
    width={24}
    height={24}
    className="h-6 w-6 object-contain"
  />
);

const SocialButton = ({ iconUrl }: { iconUrl: string }) => (
  <IconButton
    icon={<SocialIcon iconUrl={iconUrl} />}
    className={mergeClassnames(
      'h-11 border border-solid border-[#E3E5EB] bg-white',
      'hover:border-[#E3E5EB] hover:bg-[#F3F4F6]',
    )}
  />
);

export default SocialButton;
