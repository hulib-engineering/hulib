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
  // const userInfo = useAppSelector(state => state.auth.userInfo);
  // const [roleUser, setRoleUser] = useState<Role | null>(null);

  // useEffect(() => {
  //   if (userInfo) {
  //     setRoleUser(userInfo.role?.id);
  //   }
  // }, [userInfo]);

  // if (!roleUser) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  // if (roleUser === Role.ADMIN) {
  //   return (
  //     <AdminLayout className="h-full bg-neutral-98">
  //       <div className="flex flex-1 items-center justify-center">
  //         <div className="text-center">
  //           <div className="mb-2 flex justify-center gap-1">
  //             <span className="text-2xl">💕</span>
  //           </div>
  //           <p className="text-lg font-medium text-neutral-20">
  //             You have a warm heart
  //           </p>
  //         </div>
  //       </div>
  //     </AdminLayout>
  //   );
  // }

  return (
    <div className="mx-auto w-full bg-neutral-98 py-6 lg:w-5/6 lg:py-8">
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
