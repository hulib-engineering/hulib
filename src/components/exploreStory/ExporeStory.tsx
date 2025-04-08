'use client';

import { CaretCircleDown, CaretCircleUp } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';
import ListTopics from '@/components/stories/ListTopics';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

import { FlipBook } from '../flipBook/FlipBook';

type ExporeStoryProps = {
  topicIds: string | null;
};

const ExploreStory = ({ topicIds }: ExporeStoryProps) => {
  const t = useTranslations('ExporeStory');

  const [isExpandList, setIsExpandList] = React.useState(false);
  const [limit, setLimit] = React.useState(5);

  const {
    data: storiesPages,
    isLoading,
    isFetching,
  } = useGetStoriesQuery({
    page: 1,
    limit,
    topicIds: topicIds ? topicIds.split(',').map(Number) : undefined,
  });
  const onClickSeeAll = () => {
    setIsExpandList((prev) => !prev);
  };

  React.useEffect(() => {
    if (isExpandList) {
      setLimit(0);
    } else {
      setLimit(5);
    }
  }, [isExpandList]);

  if (isLoading || isFetching) return <StoriesSkeleton />;

  return (
    <div className="mx-auto h-full w-full max-w-[1216px] rounded-lg">
      <div>
        <h3 className="text-[2.5rem] font-bold leading-[3rem] text-neutral-20">
          {t('title')}
        </h3>
        <p className="text-lg font-normal text-[#2E3032]">{t('description')}</p>
      </div>
      <ListTopics />
      <div
        className={mergeClassnames(
          'mt-6 grid grid-cols-1 gap-8',
          'md:grid-cols-2',
          'xl:grid-cols-3',
        )}
      >
        {storiesPages?.data?.map((story: StoryType) => (
          // <Story key={story?.id} data={story} />
          <FlipBook key={story?.id} data={story} />
        ))}
      </div>

      {(limit === 5 && storiesPages?.hasNextPage) ||
      (limit === 0 && !storiesPages?.hasNextPage) ? (
        <div className="mt-6 flex w-full items-center justify-center">
          <Button
            variant="outline"
            iconLeft={
              limit === 0 ? (
                <CaretCircleUp size={16} color="#0442BF" />
              ) : (
                <CaretCircleDown size={16} color="#0442BF" />
              )
            }
            onClick={onClickSeeAll}
          >
            {limit === 0 ? t('hide_all') : t('view_more')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ExploreStory;
