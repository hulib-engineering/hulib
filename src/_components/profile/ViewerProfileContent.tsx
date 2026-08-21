'use client';

import { ControlOverview } from './ControlOverview';
import HuberSchedulePanel from './HuberSchedulePanel';
import MyFavoritePanel from './MyFavoritePanel';
import MyAboutPanel from './MyAboutPanel';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import { HUBER_VIEWER_TABS, LIBER_VIEWER_TABS } from '@/features/users/constants/profile.contant';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';
import type { TUserDetail } from '@/features/users/types';
import { buildUserData } from '@/features/users/utils/profile.util';
import { Role } from '@/types/common';

type ViewerProfileContentProps = {
  userDetail: TUserDetail;
};

export default function ViewerProfileContent({ userDetail }: ViewerProfileContentProps) {
  const showTopics = userDetail.role?.id === Role.HUBER;
  const tabs = showTopics ? HUBER_VIEWER_TABS : LIBER_VIEWER_TABS;
  const { currentTab, setCurrentTab, translatedTabs } = useProfileTab(tabs);
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <MyAboutPanel
          data={userData}
          editable={false}
          showTopics={showTopics}
        />
      )}
      {currentTab === 'stories' && (
        <MyStoriesPanel
          topics={userDetail?.humanBookTopic}
          storyOwnerId={userDetail.id}
          showOthers
          variant={showTopics ? 'huber' : 'liber'}
        />
      )}
      {currentTab === 'my_favorite' && (
        <MyFavoritePanel userId={userDetail.id} readOnly />
      )}
      {currentTab === 'my_schedule' && showTopics && (
        <HuberSchedulePanel huberId={userDetail.id} />
      )}
    </ControlOverview>
  );
}
