import Banner from './Banner';
import HuberCTA from './HuberCTA';
import RecommendedHuberList from './RecommendedHuberList';
import { MostPopularStoryList, NewestStoryList, StoryListByMostPopularTopics } from './StoryLists';

export default function HomePageContent() {
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
}
