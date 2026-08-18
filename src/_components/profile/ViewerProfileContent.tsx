'use client';

import { ControlOverview } from './ControlOverview';
import { VIEWER_TABS } from '@/features/users/constants/profile.contant';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';

export default function ViewerProfileContent() {
  const { currentTab, setCurrentTab, translatedTabs } = useProfileTab(VIEWER_TABS);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <>My About Content</>
      )}
    </ControlOverview>
  );
}
