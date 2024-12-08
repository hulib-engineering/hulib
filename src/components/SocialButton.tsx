import Image from 'next/image';
import type { ReactNode } from 'react';
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

type ISocialButtonProps = {
  iconUrl: string;
  children?: ReactNode;
  className?: string;
  onClick: () => void;
};

const SocialButton = (props: ISocialButtonProps) => (
  <IconButton
    icon={<SocialIcon iconUrl={props.iconUrl} />}
    className={mergeClassnames(
      'h-11 border border-solid border-[#E3E5EB] bg-white text-center text-neutral-10 text-sm',
      'hover:border-[#E3E5EB] hover:bg-[#F3F4F6]',
      props.className,
    )}
    onClick={props.onClick}
  >
    {props.children}
  </IconButton>
);

export default SocialButton;
