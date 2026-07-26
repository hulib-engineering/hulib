'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import type { ButtonSettingsProps } from '@/components/core/button/private/types';
import Button from '@/components/core/button/Button';
import { useRouter } from '@/libs/i18nNavigation';

const HeroCTAButton = ({
  className,
  iconRight,
}: {
  className?: string;
  iconRight?: ButtonSettingsProps['iconRight'];
}) => {
  const t = useTranslations('Index');
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session?.accessToken) {
      router.push('/register-huber/policy');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <Button onClick={handleClick} size="lg" className={className} iconRight={iconRight}>
      {t('hero_call_to_action')}
    </Button>
  );
};

export default HeroCTAButton;
