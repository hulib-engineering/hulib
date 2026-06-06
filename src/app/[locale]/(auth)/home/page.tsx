import { getTranslations } from 'next-intl/server';

import Banner from './_components/Banner';
import { MostPopularStoryList, NewestStoryList, StoryListByMostPopularTopics } from './_components/IndexStoryLists';
import RecommendedHuberList from './_components/RecommendedHuberList';
import HuberCTA from './_components/HuberCTA';

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
