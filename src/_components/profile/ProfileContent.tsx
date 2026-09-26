import { ControlOverview } from './ControlOverview';
import HuberSchedulePanel from './HuberSchedulePanel';
import MyFavoritePanel from './MyFavoritePanel';
import MyAboutPanel from './MyAboutPanel';
import PersonalInformation from './PersonalInformation';
import MyFeedbackPanel from './MyFeedbackPanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import useProfileActions from '@/features/users/hooks/useProfileActions';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';
import { TAB_SETS } from '@/features/users/constants/profile.contant';
import type { TUserDetail } from '@/features/users/types';
import { buildUserData } from '@/features/users/utils/profile.util';
import { Role } from '@/types/common';

type HuberProfileContentProps = {
  userDetail: TUserDetail;
  // mode: 'liber' | 'huber' | 'viewer';
  isViewer?: boolean;
};

export default function ProfileContent({ userDetail, isViewer = false }: HuberProfileContentProps) {
  const isHuber = userDetail.role?.id === Role.HUBER;

  const tabs = TAB_SETS[isHuber ? 'huber' : 'liber'][isViewer ? 'viewer' : 'own'];
  const { currentTab, setCurrentTab, topicsData, translatedTabs } = useProfileTab(tabs as readonly { value: string; label: string }[], !isViewer && isHuber);
  const { handleSaveText, handleSaveLearningEntry, handleSaveWorkEntry, handleSaveTopics } = useProfileActions(isViewer); // [N1]
  // [N1]: if need to be able to skip handleSaveTopics as well: pass !isHuber or isLiber in as some sort of conditions as well - and also...
  // ...modify the hook's internal (add some simple skip condition and return lines)
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="max-lg:p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={userData}
          editable={!isViewer}
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
          variant={isHuber ? 'huber' : 'liber'}
        />
      )}
      {currentTab === 'favorite'
      && (
        <MyFavoritePanel
          userId={isViewer ? userDetail.id : undefined}
          readOnly={isViewer}
        />
      )}
      {currentTab === 'schedule' && <HuberSchedulePanel huberId={userDetail.id} />}
      {currentTab === 'personal_info' && <PersonalInformation data={userDetail} />}
      {currentTab === 'feedback' && <MyFeedbackPanel huberId={userDetail.id} />}
    </ControlOverview>
  );
}
