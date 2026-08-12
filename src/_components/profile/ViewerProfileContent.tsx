'use client';

import { ControlOverview } from './ControlOverview';
import AboutPanel from './MyAboutPanel';
import type { TUserDetail } from '@/features/users/types';
import { VIEWER_TABS } from '@/features/users/constants/profile.contant';
import { buildUserData } from '@/features/users/utils/profile.util';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';

type ViewerProfileContentProps = {
  userDetail: TUserDetail;
};

export default function ViewerProfileContent({ userDetail }: ViewerProfileContentProps) {
  const { currentTab, setCurrentTab, topicsData, translatedTabs } = useProfileTab(VIEWER_TABS);
  const userData = buildUserData(userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <AboutPanel
          data={userData}
          availableTopics={topicsData?.data}
          editable={false}
        />
      )}
    </ControlOverview>
  );
}
