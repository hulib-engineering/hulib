import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';

const SocialIcon = ({ iconUrl }: { iconUrl: string }) => {
  const t = useTranslations('Accessibility');
  return (
    <Image
      src={iconUrl}
      alt={t('social_icon')}
      width={24}
      height={24}
      className="size-6 object-contain"
    />
  );
};

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
        size="lg"
        className={mergeClassnames(
          'bg-white border-neutral-variant-90',
          'hover:bg-neutral-variant-98 hover:border-neutral-variant-80',
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
      className={mergeClassnames(
        'border-neutral-variant-90 bg-white md:text-neutral-10',
        'hover:bg-neutral-variant-98 hover:border-neutral-variant-80',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.variant === 'google' ? `${t('log_in')} ${t('with_gg')}` : 'Log in with Facebook'}
    </Button>
  );
};

export default SocialButton;
