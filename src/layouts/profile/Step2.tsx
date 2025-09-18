'use client';

import { useTranslations } from 'next-intl';

import TimeslotRegistrationSection from '@/layouts/timeslots/TimeslotRegistrationSection';

const Step2 = ({ onBack, next }: { onBack: () => void; next: () => void }) => {
  const t = useTranslations('HumanBookRegister.Step2');

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-[20px] bg-white p-5">
      <h2 className="text-2xl font-medium text-black xl:text-4xl">{t('title')}</h2>
      <TimeslotRegistrationSection onBack={onBack} onSucceed={next} />
    </div>
  );
};

export default Step2;
