'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import HuberList from '@/components/research/HuberList';
import NewestBooks from '@/components/research/NewestBooks';
import SearchTabs from '@/components/research/SearchTabs';
import CommonLayout from '@/layouts/CommonLayout';
import { useGetSearchByKeywordQuery } from '@/libs/services/modules/stories';

const Page = () => {
  const searchParams = useSearchParams();
  const t = useTranslations('Research');

  const [activeTab, setActiveTab] = useState<'all' | 'story' | 'huber'>('all');
  const keyword = searchParams.get('keyword') || '';

  const { data, isLoading: loadingStories } = useGetSearchByKeywordQuery({
    keyword,
  });

  const searchResultInfo = useMemo(() => {
    const stories = data?.stories || [];
    const hubers = data?.hubers || [];
    const totalResults = stories.length + hubers.length;

    const getMessage = (key: any, count: number) => (
      <>
        <span className="text-primary-50">{count}</span> {t(key)}{' '}
        <span className="font-bold">&quot;{keyword}&quot;</span>
      </>
    );

    switch (activeTab) {
      case 'story':
        return getMessage('results.story_match', stories.length);
      case 'huber':
        return getMessage('results.huber_match', hubers.length);
      default:
        return getMessage('results.all_match', totalResults);
    }
  }, [activeTab, data?.stories, data?.hubers, keyword, t]);

  const renderContent = useCallback(() => {
    const stories = data?.stories || [];
    const hubers = data?.hubers || [];

    switch (activeTab) {
      case 'story':
        return (
          <NewestBooks stories={stories} loadingStories={loadingStories} />
        );
      case 'huber':
        return <HuberList hubers={hubers} loadingHubers={loadingStories} />;
      default:
        return (
          <>
            <NewestBooks stories={stories} loadingStories={loadingStories} />
            <HuberList hubers={hubers} loadingHubers={loadingStories} />
          </>
        );
    }
  }, [activeTab, data?.stories, data?.hubers, loadingStories]);

  return (
    <CommonLayout className="bg-white">
      <SearchTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      {keyword && !loadingStories && (
        <div className="text-black-500 mb-4 text-sm">{searchResultInfo}</div>
      )}

      {renderContent()}
    </CommonLayout>
  );
};

export default Page;
