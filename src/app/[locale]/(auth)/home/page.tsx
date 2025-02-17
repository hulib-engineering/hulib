import Banner from '@/components/home/Banner';
import ExporeStories from '@/components/home/ExporeStories';
import NewestStories from '@/components/home/NewestStories';
import RecommendedHubers from '@/components/home/RecommendedHubers';
import ShortDescription from '@/components/home/ShortDescription';
import CommonLayout from '@/layouts/CommonLayout';

const Page = () => {
  return (
    <CommonLayout>
      <Banner />
      <NewestStories />
      <RecommendedHubers />
      <ExporeStories />
      <ShortDescription />
    </CommonLayout>
  );
};

export default Page;
