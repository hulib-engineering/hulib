/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import { useTranslations } from 'next-intl';

import ListHubers from './ListHuber';

const RecommendedHubers = () => {
  const t = useTranslations('Home');

  return (
    <div className="mt-8 items-center justify-center rounded-lg bg-white p-5">
      <h3 className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10">
        {t('recommended_hubers.title')}
      </h3>
      <ListHubers />
    </div>
  );
};

export default RecommendedHubers;
