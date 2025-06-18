import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import ProfileInfo from '@/features/users/components/ProfileInfo';

const activityTabs = [
  { key: 'completed', label: 'Completed meeting', icon: '📅' },
  { key: 'declined', label: 'Declined meeting', icon: '🚫' },
  { key: 'missed', label: 'Missed meeting', icon: '⚠️' },
];

const ProfileLiber = ({ data }: any) => {
  const router = useRouter();
  // State for selected activity tab
  const [selectedTab, setSelectedTab] = useState(
    activityTabs[0]?.key || 'completed',
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header Section */}
      {/* Back to data Management */}
      <div className="flex items-center px-6 pb-2 pt-6">
        <button
          type="button"
          className="mr-2 text-primary-60 hover:underline focus:outline-none"
          onClick={() => router.push('/admin/users')}
          aria-label="Back to data management"
        >
          ← Back to data management
        </button>
      </div>
      <ProfileInfo data={data} />

      {/* Main Content Section */}
      <div className="mx-auto mt-8 flex w-full flex-col rounded-lg bg-white shadow-md lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="mb-4 w-full max-w-xs shrink-0 lg:mb-0">
          <div className="flex flex-col gap-2 border p-4">
            <span className="mb-2 text-sm font-semibold text-neutral-60">
              {data?.fullName || '-'}&rsquo;s Activities
            </span>
            {activityTabs.map((tab) => (
              <button
                type="button"
                key={tab.key}
                className={`flex items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-primary-90 text-primary-40'
                    : 'text-primary-20 hover:bg-primary-80'
                }`}
                onClick={() => setSelectedTab(tab.key)}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Main Activity Content */}
        <div className="flex min-h-[200px] w-full flex-1 flex-col border p-8">
          {/* Placeholder for activity content */}
          <span className="text-base font-medium text-black">
            {activityTabs.find((t) => t.key === selectedTab)?.label}
          </span>
          <div className="mt-4 text-neutral-60">
            {/* TODO: Replace with real content for each activity */}
            No data to display yet.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLiber;
