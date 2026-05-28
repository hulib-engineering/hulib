import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
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

type ISocialButtonProps = {
  className?: string;
  iconOnly?: boolean;
  variant: 'facebook' | 'google';
  onClick: () => void;
};

const SocialButton = (props: ISocialButtonProps) => {
  const t = useTranslations('SignIn');

  if (props.iconOnly) {
    return (
      <IconButton
        variant="outline"
        className={mergeClassnames(
          props.className,
        )}
        onClick={props.onClick}
      >
        <SocialIcon iconUrl={props.variant === 'facebook' ? '/assets/icons/Facebook.svg' : '/assets/icons/google-icon.svg'} />
      </IconButton>
    );
  }

  return (
    <Button
      variant="outline"
      iconLeft={<SocialIcon iconUrl={props.variant === 'facebook' ? '/assets/icons/Facebook.svg' : '/assets/icons/google-icon.svg'} />}
      className={mergeClassnames('md:text-neutral-10', props.className)}
      onClick={props.onClick}
    >
      {props.variant === 'google' ? `${t('log_in')} ${t('with_gg')}` : 'Log in with Facebook'}
    </Button>
  );
};

export default SocialButton;
