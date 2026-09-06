import { ControlOverview } from './ControlOverview';
import HuberSchedulePanel from './HuberSchedulePanel';
import MyFavoritePanel from './MyFavoritePanel';
import MyAboutPanel from './MyAboutPanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import useProfileActions from '@/features/users/hooks/useProfileActions';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';
import { HUBER_OWN_TABS, LIBER_OWN_TABS } from '@/features/users/constants/profile.contant';
import type { TUserDetail } from '@/features/users/types';
import { buildUserData } from '@/features/users/utils/profile.util';

type HuberProfileContentProps = {
  userDetail: TUserDetail;
  mode: 'liber' | 'huber' | 'viewer';
};

export default function ProfileContent({ userDetail, mode }: HuberProfileContentProps) {
  const isHuber = mode === 'huber';
  const isViewer = mode === 'viewer';
  const isLiber = mode === 'liber';

  const { currentTab, setCurrentTab, topicsData, translatedTabs } = useProfileTab(isHuber ? HUBER_OWN_TABS : LIBER_OWN_TABS, isHuber);
  const { handleSaveText, handleSaveLearningEntry, handleSaveWorkEntry, handleSaveTopics } = useProfileActions(isViewer);
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={userData}
          editable={isViewer}
          showTopics={isHuber}
          availableTopics={topicsData?.data}
          onSaveText={handleSaveText}
          onSaveLearningEntry={handleSaveLearningEntry}
          onSaveWorkEntry={handleSaveWorkEntry}
          onSaveTopics={handleSaveTopics}
        />
      )}
      {currentTab === 'stories' && (
        <MyStoriesPanel
          topics={userDetail?.humanBookTopic}
          storyOwnerId={userDetail.id}
          showOthers={isViewer}
          variant={isLiber ? 'liber' : 'huber'}
        />
      )}
      {currentTab === 'my_favorite' && <MyFavoritePanel />}
      {currentTab === 'my_schedule' && <HuberSchedulePanel huberId={userDetail.id} />}
      {currentTab === 'my_feedback' && <>My feedback</>}
      {currentTab === 'personal_info' && <>personal_info</>}
    </ControlOverview>
  );
}
