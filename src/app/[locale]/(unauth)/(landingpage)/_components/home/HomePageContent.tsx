import dynamic from 'next/dynamic';
import Banner from './Banner';
import { NewestStoryList } from './NewestStoryList';
import { MostPopularStoryList } from './MostPopularStoryList';
import { HuberCardListSkeleton, StoriesSkeleton } from '@/components/loadingState/Skeletons';

const RecommendedHuberList = dynamic(
  () => import('./RecommendedHuberList'),
  { ssr: true, loading: () => <HuberCardListSkeleton /> },
);

const StoryListByMostPopularTopics = dynamic(
  () => import('./StoryListByMostPopularTopics').then(mod => mod.StoryListByMostPopularTopics),
  { ssr: true, loading: () => <StoriesSkeleton /> },
);

const HuberCTA = dynamic(
  () => import('./HuberCTA'),
  { ssr: true, loading: () => <div className="h-[403px] md:h-[532px]" /> },
);

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
