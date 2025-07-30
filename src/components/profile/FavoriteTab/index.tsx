// import { useParams } from 'next/navigation';

import FavoriteList from '@/components/stories/FavoriteList';
import { useAppSelector } from '@/libs/hooks';
import { useGetFavoritesStoryQuery } from '@/libs/services/modules/fav-stories';

const FavoriteTab = () => {
  const userInfo = useAppSelector(state => state.auth.userInfo);
  const { data: stories, isLoading } = useGetFavoritesStoryQuery(userInfo?.id, {
    skip: !userInfo?.id,
  });

  return (
    <FavoriteList title="" stories={stories} isLoading={isLoading} showTopics />
  );
};

export default FavoriteTab;
