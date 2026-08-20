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
  const { currentTab, setCurrentTab, translatedTabs } = useProfileTab(LIBER_OWN_TABS);
  const { handleSaveText, handleSaveLearningEntry, handleSaveWorkEntry } = useLiberProfileActions();
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={userData}
          editable
          showTopics={false}
          onSaveText={handleSaveText}
          onSaveLearningEntry={handleSaveLearningEntry}
          onSaveWorkEntry={handleSaveWorkEntry}
        />
      )}
      {currentTab === 'stories' && (
        <MyStoriesPanel topics={userDetail?.humanBookTopic} storyOwnerId={userDetail.id} variant="liber" />
      )}
      {currentTab === 'my_favorite' && <LiberMyFavorite />}
    </ControlOverview>
  );
}
