import useLiberProfileActions from '../../features/users/hooks/useProfileActions';
import { ControlOverview } from './ControlOverview';
import MyAboutPanel from './MyAboutPanel';
import MyFavoritePanel from './MyFavoritePanel';
import MyFeedbackPanel from './MyFeedbackPanel';
import MySchedulePanel from './MySheadulePanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import type { TUserDetail } from '@/features/users/types';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';
import { HUBER_OWN_TABS } from '@/features/users/constants/profile.contant';
import { buildUserData } from '@/features/users/utils/profile.util';

type HuberProfileContentProps = {
  userDetail: TUserDetail;
};

export default function HuberProfileContent({ userDetail }: HuberProfileContentProps) {
  const { currentTab, setCurrentTab, topicsData, translatedTabs } = useProfileTab(HUBER_OWN_TABS);
  const { handleSaveText, handleSaveLearningEntry, handleSaveWorkEntry, handleSaveTopics } = useLiberProfileActions();
  const uerData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={uerData}
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
      {currentTab === 'my_favorite' && <MyFavoritePanel />}
      {currentTab === 'my_schedule' && <MySchedulePanel />}
      {currentTab === 'my_feedback' && <MyFeedbackPanel userId={userDetail.id} />}
    </ControlOverview>
  );
}
