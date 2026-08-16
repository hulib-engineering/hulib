import { ControlOverview } from './ControlOverview';
import { useProfileTab } from '@/features/users/hooks/useProfileTab';
import { HUBER_OWN_TABS } from '@/features/users/constants/profile.contant';

export default function HuberProfileContent() {
  const { currentTab, setCurrentTab, translatedTabs } = useProfileTab(HUBER_OWN_TABS);

  return (
    <ControlOverview className="p-2" currentTab={currentTab} onTabChange={setCurrentTab} tabs={translatedTabs}>
      {currentTab === 'about' && (
        <>My About Content</>
      )}
      {currentTab === 'stories' && (
        <>My stories</>
      )}
      {currentTab === 'my_favorite' && <>My Favorites</>}
      {currentTab === 'my_schedule' && <>My Schedule</>}
      {currentTab === 'my_feedback' && <>My feedback</>}
    </ControlOverview>
  );
}
