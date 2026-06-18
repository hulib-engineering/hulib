import { getTranslations } from 'next-intl/server';

import Banner from './_components/home/Banner';
import { MostPopularStoryList, NewestStoryList, StoryListByMostPopularTopics } from './_components/home/LandingPageStoryLists';
import RecommendedHuberList from './_components/home/RecommendedHuberList';
import HuberCTA from './_components/home/HuberCTA';

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
