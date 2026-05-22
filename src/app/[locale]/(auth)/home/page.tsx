import { getTranslations } from 'next-intl/server';

import RecommendedHuberList from '@/layouts/hubers/RecommendedHuberList';
import Banner from '@/layouts/index/Banner';
import HuberCTA from '@/layouts/index/HuberCTA';
import { MostPopularStoryList, NewestStoryList, StoryListByMostPopularTopics } from '@/layouts/stories/IndexStoryLists';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Index() {
  return (
    <div className="mx-auto w-full bg-neutral-98 py-6 xl:w-[1216px] xl:py-8">
      <div className="flex flex-col gap-6">
        <Banner />
        <NewestStoryList />
        <MostPopularStoryList />
        <RecommendedHuberList />
        <StoryListByMostPopularTopics />
        <HuberCTA />
      </div>
    </div>
  );
};
