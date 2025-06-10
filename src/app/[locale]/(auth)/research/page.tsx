'use client';

import Banner from '@/components/home/Banner';
import NewestStories from '@/components/home/NewestStories';
import CommonLayout from '@/layouts/CommonLayout';

const Page = () => {
  return (
    <CommonLayout className="bg-white">
      <Banner />
      <NewestStories />
    </CommonLayout>
  );
};

export default Page;
