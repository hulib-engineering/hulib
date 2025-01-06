import { CheckCircle } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '../button/Button';

const Success = () => {
  const t = useTranslations('HumanBookRegister');
  const router = useRouter();
  const handleBackToHome = () => {
    router.push('/');
    router.refresh();
  };
  return (
    <div className="flex h-screen w-[384px] flex-col items-center justify-center gap-5">
      <CheckCircle className="size-[72px] text-[#46D51B]" />
      <p className="text-sm font-normal leading-5">
        {t('success_submit_form')}
      </p>
      <Button className="mt-5 w-full" onClick={handleBackToHome}>
        {t('back_to_home')}
      </Button>
    </div>
  );
};

export default Success;
