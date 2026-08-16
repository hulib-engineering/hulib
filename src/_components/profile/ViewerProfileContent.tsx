'use client';

import { ControlOverview } from './ControlOverview';
import type { TUserDetail } from '@/features/users/types';
import { VIEWER_TABS } from '@/features/users/constants/profile.contant';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';

type ViewerProfileContentProps = {
  userDetail: TUserDetail;
};

export default function ViewerProfileContent({ userDetail }: ViewerProfileContentProps) {
  const { currentTab, setCurrentTab, translatedTabs } = useProfileTab(VIEWER_TABS);

  console.log('ViewerProfileContent userDetail:', userDetail);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <>My About Content</>
      )}
    </ControlOverview>
  );
}
