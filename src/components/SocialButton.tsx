import Image from 'next/image';
import React from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';

const SocialIcon = ({ iconUrl }: { iconUrl: string }) => (
  <Image
    src={iconUrl}
    alt="Social icon"
    width={24}
    height={24}
    className="size-6 object-contain"
  />
);

type ISocialButtonProps = WithChildren<{
  iconUrl: string;
  className?: string;
  onClick: () => void;
}>;

const SocialButton = (props: ISocialButtonProps) => (
  <>
    <IconButton
      className={mergeClassnames(
        'hidden h-11 border border-solid border-[#E3E5EB] bg-white text-center text-neutral-10 text-sm',
        'hover:border-[#E3E5EB] hover:bg-neutral-variant-98',
        'xl:flex',
        props.className,
      )}
      onClick={props.onClick}
    >
      <SocialIcon iconUrl={props.iconUrl} />
    </IconButton>
    <Button
      variant="outline"
      size="sm"
      iconLeft={(
        <Image
          src={props.iconUrl}
          alt="Social icon"
          width={16}
          height={16}
          className="size-4 object-contain"
        />
      )}
      className={mergeClassnames('xl:hidden', props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  </>

);

export default SocialButton;
