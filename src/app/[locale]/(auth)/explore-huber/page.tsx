'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import ListHuber from '@/components/huber/ListHuber';
import { mergeClassnames } from '@/components/core/private/utils';
import ListTopics from '@/components/stories/ListTopics';
import { useTopics } from '@/libs/hooks';

const ExploreHuber = () => {
  const searchParams = useSearchParams();
  const { topics, isLoading } = useTopics();
  const topicIds = searchParams.get('topicIds')?.split(',') || []; // Convert topicIds to an array
  const t = useTranslations('Huber');

  return (
    <div
      className={mergeClassnames(
        'mx-auto h-full w-full  px-5 py-12 rounded-lg',
        'md:px-28 ',
      )}
    >
      <div className="size-full max-w-[1216px] rounded-lg text-[40px] font-bold">
        {t('title')}
      </div>
      <div className="text-lg font-normal">{t('description')}</div>
      <ListTopics currentPathName="explore-huber" />
      {!isLoading && (
        <ListHuber topicIds={topicIds} topics={topics} />
      )}
    </div>
  );
};

export default ExploreHuber;
