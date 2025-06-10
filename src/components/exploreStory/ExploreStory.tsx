'use client';

/* eslint-disable no-unsafe-optional-chaining */

import { useTranslations } from 'next-intl';
import React from 'react';

import StoriesList from '@/components/stories/StoriesList';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';

type ExploreStoryProps = {
  topicIds: string | null;
};

const ExploreStory = ({ topicIds }: ExploreStoryProps) => {
  const t = useTranslations('ExploreStory');
  const [isExpandList, setIsExpandList] = React.useState(false);
  const [limit, setLimit] = React.useState(6);

  const {
    data: storiesPages,
    isLoading,
    isFetching,
    refetch: refetchStories,
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
      setLimit(6);
    }
  }, [isExpandList]);

  return (
    <div className="mx-auto h-full w-full max-w-[1216px] rounded-lg">
      <StoriesList
        title={t('title')}
        description={t('description')}
        stories={storiesPages?.data}
        isLoading={isLoading || isFetching}
        showTopics
        hasNextPage={storiesPages?.hasNextPage}
        refetchStories={refetchStories}
        onSeeAllClick={onClickSeeAll}
        isExpandable
        isExpanded={isExpandList}
        seeAllText={t('view_more')}
        hideAllText={t('hide_all')}
      />
    </div>
  );
};

export default ExploreStory;
