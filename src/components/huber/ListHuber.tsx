'use client';

import { CaretCircleDown, CaretCircleUp } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import { useGetHubersQuery } from '@/libs/services/modules/huber';
import type { Huber as HuberType } from '@/libs/services/modules/huber/huberType';
import type { Topic } from '@/libs/services/modules/topics/topicType';

import Huber from './Huber';

type ListHuberProps = {
  topicId: String[] | null;
  topics: Topic[];
};

const ListHuber = ({ topicId, topics }: ListHuberProps) => {
  const [limit, setLimit] = React.useState(6);
  const [isExpandList, setIsExpandList] = React.useState(false);
  const t = useTranslations('ExporeStory');

  const {
    data: hubersData,
    isLoading,
    isFetching,
  } = useGetHubersQuery({
    page: 1,
    limit,
    topicId: topicId || undefined,
  });

  const onClickSeeAll = () => {
    setIsExpandList((prev) => !prev);
  };

  React.useEffect(() => {
    if (isExpandList) {
      setLimit(hubersData?.meta?.totalItems || 100);
    } else {
      setLimit(6);
    }
  }, [isExpandList, hubersData?.meta?.totalItems]);

  if (isLoading || isFetching) return <StoriesSkeleton />;

  const hasMoreData =
    hubersData?.meta?.currentPage < hubersData?.meta?.totalPages;

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {hubersData?.data?.map((huber: HuberType) => (
          <div key={huber.id} className="w-full">
            <Huber key={huber.id} data={huber} topics={topics} />
          </div>
        ))}
      </div>
      {(limit === 6 && hasMoreData) ||
      (limit > 6 && hubersData?.data.length > 6) ? (
        <div className="mt-6 flex w-full items-center justify-center">
          <Button
            variant="outline"
            iconLeft={
              isExpandList ? (
                <CaretCircleUp size={16} color="#0442BF" />
              ) : (
                <CaretCircleDown size={16} color="#0442BF" />
              )
            }
            onClick={onClickSeeAll}
          >
            {isExpandList ? t('hide_all') : t('view_more')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ListHuber;
