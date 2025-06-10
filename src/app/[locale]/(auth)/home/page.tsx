import ExploreStory from '@/components/exploreStory/ExploreStory';
import Banner from '@/components/home/Banner';
import ShortDescription from '@/components/home/ShortDescription';
import CommonLayout from '@/layouts/CommonLayout';

const Page = () => {
  return (
    <CommonLayout className="bg-neutral-98">
      <Banner />
      <ExploreStory topicIds={null} />
      <ShortDescription />
    </CommonLayout>
  );
};

export default Page;
