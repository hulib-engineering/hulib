'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import Huber from '@/components/huber/Huber';
import NoResultFound from '@/components/research/NoResultFound';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import type { Huber as HuberType } from '@/libs/services/modules/huber/huberType';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

interface ListHuberProps {
  hubers: HuberType[];
  loadingHubers: boolean;
}

const HuberList: React.FC<ListHuberProps> = ({ hubers, loadingHubers }) => {
  const t = useTranslations('Research');
  const { data: topicsPages } = useGetTopicsQuery();

  return (
    <div className="mt-8 items-center justify-center rounded-lg bg-white">
      <h3
        className="text-[2.375rem] font-medium leading-[2.75rem] text-primary-10"
        id="hubers-title"
      >
        {t('hubers.title')}
      </h3>
      {loadingHubers ? (
        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <StoriesSkeleton />
        </div>
      ) : hubers?.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {hubers.map((huber: HuberType) => (
            <div key={huber.id} className="w-full">
              <Huber data={huber} topics={topicsPages?.data || []} />
            </div>
          ))}
        </div>
      ) : (
        <NoResultFound className="mt-4" />
      )}
    </div>
  );
};

export default HuberList;
