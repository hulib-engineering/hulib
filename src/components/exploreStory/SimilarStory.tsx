'use client';

import { CaretCircleDown, CaretCircleUp } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import Button from '@/components/button/Button';
import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import StoriesSkeleton from '@/components/stories/StoriesSkeleton';
import { useGetSimilarStoriesQuery } from '@/libs/services/modules/stories';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

type SimilarStoryProps = {
  humanBookId: string;
  topicIds: string[] | number[];
};

const SimilarStory = ({ humanBookId, topicIds }: SimilarStoryProps) => {
  const t = useTranslations('ExporeStory');

  const [isExpandList, setIsExpandList] = React.useState(false);
  const [limit, setLimit] = React.useState(4);

  // Fetch 4 stories initially, fetch all when expanded
  const {
    data: similarStoriesPages,
    isLoading,
    isFetching,
  } = useGetSimilarStoriesQuery({
    page: 1,
    limit,
    humanBookId,
    topicIds,
  });

  const onClickSeeAll = () => {
    setIsExpandList((prev) => !prev);
  };

  React.useEffect(() => {
    if (isExpandList) {
      setLimit(0);
    } else {
      setLimit(4);
    }
  }, [isExpandList]);

  if (isLoading || isFetching) return <StoriesSkeleton />;

  return (
    <div
      className={mergeClassnames(
        'h-full w-full rounded-lg bg-white px-2 py-5',
        'md:px-5 md:py-5',
      )}
    >
      <h3 className="text-[2.5rem] font-bold leading-[3rem] text-neutral-20">
        {t('similar_stories')}
      </h3>
      <div
        className={mergeClassnames(
          'mt-6 xxl:justify-start relative flex flex-wrap items-center justify-center gap-8 2xl:gap-12',
        )}
      >
        {similarStoriesPages?.data?.map((story: StoryType) => (
          <FlipBook key={story?.id} data={story} />
        ))}
      </div>

      {(limit === 4 && similarStoriesPages?.hasNextPage) ||
      (limit === 0 && !similarStoriesPages?.hasNextPage) ? (
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
            {limit === 0 ? t('hide_all') : t('see_all')}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default SimilarStory;
