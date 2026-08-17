import { useProfileTab } from '../../features/users/hooks/useProfileTab';
import useLiberProfileActions from '../../features/users/hooks/useProfileActions';
import { ControlOverview } from './ControlOverview';
import LiberMyFavorite from './MyFavoritePanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import type { TUserDetail } from '@/features/users/types';
import { LIBER_OWN_TABS } from '@/features/users/constants/profile.contant';
import { buildUserData } from '@/features/users/utils/profile.util';
import MyAboutPanel from '@/_components/profile/MyAboutPanel';

type LiberProfileContentProps = {
  userDetail: TUserDetail;
};

export default function LiberProfileContent({ userDetail }: LiberProfileContentProps) {
  const { currentTab, setCurrentTab, topicsData, translatedTabs } = useProfileTab(LIBER_OWN_TABS, true);
  const { handleSaveText, handleSaveLearningEntry, handleSaveWorkEntry, handleSaveTopics } = useLiberProfileActions();
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={userData}
          availableTopics={topicsData?.data}
          editable
          onSaveText={handleSaveText}
          onSaveLearningEntry={handleSaveLearningEntry}
          onSaveWorkEntry={handleSaveWorkEntry}
          onSaveTopics={handleSaveTopics}
        />
      )}
      {currentTab === 'stories' && (
        <MyStoriesPanel topics={userDetail?.humanBookTopic} storyOwnerId={userDetail.id} />
      )}
      {currentTab === 'my_favorite' && <LiberMyFavorite />}
    </ControlOverview>
  );
}
