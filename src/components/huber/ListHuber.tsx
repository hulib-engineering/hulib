'use client';

import { CaretCircleDown, CaretCircleUp } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import Huber from './Huber';
import Button from '@/components/button/Button';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import { useGetHubersQuery } from '@/libs/services/modules/huber';
import type { Huber as HuberType } from '@/libs/services/modules/huber/huberType';
import type { Topic } from '@/libs/services/modules/topics/topicType';

type ListHuberProps = {
  topicIds: string[] | null;
  topics: Topic[];
};

const ListHuber = ({ topicIds, topics }: ListHuberProps) => {
  const [limit, setLimit] = React.useState(12);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const t = useTranslations('ExploreStory');
  const {
    data: hubersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetHubersQuery({
    page: 1,
    limit,
    topicIds: topicIds || undefined,
  });

  useEffect(() => {
    refetch();
  }, [topicIds, refetch]);

  const onClickSeeAll = () => {
    if (!isExpanded) {
      setLimit(prevLimit => prevLimit + 12);
      setIsExpanded(true);
    } else {
      setLimit(12);
      setIsExpanded(false);
    }
  };

  if (isLoading || isFetching) {
    return <StoriesSkeleton />;
  }
  const totalItems = hubersData?.meta?.totalItems || 0;
  const hasMoreData = limit < totalItems;

  const isFullyExpanded = limit >= totalItems;

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {hubersData?.data?.map((huber: HuberType) => (
          <div key={huber.id} className="w-full">
            <Huber key={huber.id} data={huber} topics={topics} />
          </div>
        ))}
      </div>
      {hasMoreData || isExpanded
        ? (
            <div className="mt-6 flex w-full items-center justify-center">
              <Button
                variant="outline"
                iconLeft={
                  isFullyExpanded
                    ? (
                        <CaretCircleUp size={16} color="#0442BF" />
                      )
                    : (
                        <CaretCircleDown size={16} color="#0442BF" />
                      )
                }
                onClick={onClickSeeAll}
              >
                {isFullyExpanded ? t('hide_all') : t('view_more')}
              </Button>
            </div>
          )
        : null}
    </div>
  );
};

export default ListHuber;
