'use client';

import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

type TabType = 'all' | 'story' | 'huber';

type SearchTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  className?: string;
};

const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const t = useTranslations('Research');

  const tabs = useMemo(
    () => [
      { key: 'all' as TabType, label: t('tabs.all') || 'All' },
      { key: 'story' as TabType, label: t('tabs.story') || 'Story' },
      { key: 'huber' as TabType, label: t('tabs.huber') || 'Huber' },
    ],
    [t],
  );

  return (
    <div className={`flex gap-3 ${className}`}>
      {tabs.map(tab => (
        <button
          type="button"
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`
            rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
            ${
        activeTab === tab.key
          ? 'bg-primary-80 text-primary-60 shadow-md'
          : 'bg-neutral-90 text-neutral-20 hover:bg-gray-300'
        }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
