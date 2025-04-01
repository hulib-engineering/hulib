import Banner from '@/components/home/Banner';
import ExploreStories from '@/components/home/ExploreStories';
import NewestStories from '@/components/home/NewestStories';
import RecommendedHubers from '@/components/home/RecommendedHubers';
import ShortDescription from '@/components/home/ShortDescription';
import CommonLayout from '@/layouts/CommonLayout';

const Page = () => {
  return (
    <CommonLayout className="bg-white">
      <Banner />
      <NewestStories />
      <RecommendedHubers />
      <ExploreStories />
      <ShortDescription />
    </CommonLayout>
  );
};

export default Page;
