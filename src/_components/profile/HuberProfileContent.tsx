import { ControlOverview } from './ControlOverview';
import HuberSchedulePanel from './HuberSchedulePanel';
import MyFavoritePanel from './MyFavoritePanel';
import MyAboutPanel from './MyAboutPanel';
import MyFeedbackPanel from './MyFeedbackPanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import useProfileActions from '@/features/users/hooks/useProfileActions';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';
import { HUBER_OWN_TABS } from '@/features/users/constants/profile.contant';
import type { TUserDetail } from '@/features/users/types';
import { buildUserData } from '@/features/users/utils/profile.util';

type HuberProfileContentProps = {
  userDetail: TUserDetail;
};

export default function HuberProfileContent({ userDetail }: HuberProfileContentProps) {
  const { currentTab, setCurrentTab, topicsData, translatedTabs } = useProfileTab(HUBER_OWN_TABS, true);
  const { handleSaveText, handleSaveLearningEntry, handleSaveWorkEntry, handleSaveTopics } = useProfileActions();
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={userData}
          editable
          showTopics
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
          variant="huber"
        />
      )}
      {currentTab === 'my_favorite' && <MyFavoritePanel />}
      {currentTab === 'my_schedule' && <HuberSchedulePanel huberId={userDetail.id} />}
      {currentTab === 'my_feedback' && <MyFeedbackPanel huberId={userDetail.id} />}
    </ControlOverview>
  );
}
