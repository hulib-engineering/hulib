'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CreateStoryCard from './CreateStoryCard';
import MyStoriesEmptyState from './MyStoriesEmptyState';
import StoriesOthersEmptyState from './StoriesOthersEmptyState';
import MyStoryCard from './MyStoryCard';
import Modal from '@/components/Modal';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import { StoryCard } from '@/features/stories/components/StoryCard';
import StoryForm from '@/features/stories/components/StoryForm';
import FirstBookCreatedModal from '@/features/stories/components/FirstBookCreatedModal';
import { useGetHuberStoriesQuery } from '@/libs/services/modules/huber';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import type { Topic } from '@/libs/services/modules/user/userType';
import { mergeClassnames } from '@/components/core/private/utils';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';

type TTopic = {
  userId: number;
  topicId: number;
  topic: Topic;
};

type MyStoriesPanelProps = {
  storyOwnerId: number;
  topics?: TTopic[];
  showOthers?: boolean;
  variant?: 'liber' | 'huber';
};

export default function MyStoriesPanel({
  storyOwnerId,
  topics = [],
  showOthers = false,
  variant = 'huber',
}: MyStoriesPanelProps) {
  const tMyProfile = useTranslations('MyProfile');
  const { data: stories, isLoading } = useGetHuberStoriesQuery(
    { huberId: storyOwnerId, publishedOnly: showOthers },
    { skip: !storyOwnerId },
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFirstBookModalOpen, setIsFirstBookModalOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | 'all'>('all');

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setIsFirstBookModalOpen(true);
  };

  const storyItems: TStory[] = stories?.data ?? [];
  const topicFilters: Topic[] = (topics.length > 0
    ? topics.map(item => item.topic)
    : storyItems.flatMap((story: TStory) => story.topics ?? []) as Topic[])
    .filter((topic: Topic, index: number, source: Topic[]) => source.findIndex(item => item.id === topic.id) === index);
  const filteredStories = selectedTopicId === 'all'
    ? storyItems
    : storyItems.filter((story: TStory) => story.topics?.some(topic => topic.id === selectedTopicId));
  const isEmpty = storyItems.length === 0;
  const isHuberOwnStories = !showOthers && variant === 'huber';

  return (
    <div className="lg:px-0">
      {isLoading && <StoriesSkeleton />}
      {!isLoading && isEmpty && showOthers && <StoriesOthersEmptyState />}
      {!isLoading && isEmpty && !showOthers && (
        <MyStoriesEmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
      )}
      {!isLoading && !isEmpty && (
        <div className="flex flex-col gap-6">
          {isHuberOwnStories && topicFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTopicId('all')}
                className={mergeClassnames(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  selectedTopicId === 'all'
                    ? 'border-primary-70 bg-primary-90 text-primary-50 shadow-[0_4px_12px_rgba(8,88,250,0.14)]'
                    : 'border-primary-90 bg-white text-primary-50 hover:border-primary-70 hover:bg-primary-98',
                )}
              >
                {tMyProfile('all')}
              </button>
              {topicFilters.map(topic => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={mergeClassnames(
                    'max-w-[180px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-transform hover:-translate-y-0.5',
                    getTopicBadgeClasses(topic.color),
                    selectedTopicId === topic.id
                      ? 'shadow-[0_4px_12px_rgba(136,69,198,0.18)] ring-2 ring-primary-80'
                      : 'opacity-80 hover:opacity-100',
                  )}
                >
                  <span className="line-clamp-1">{topic.name}</span>
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {!showOthers && <CreateStoryCard onClick={() => setIsCreateModalOpen(true)} className="w-full max-w-none" />}
            {filteredStories.map((story: TStory) => (
              showOthers
                ? <StoryCard key={story.id} data={story} />
                : <MyStoryCard key={story.id} data={story} />
            ))}
          </div>
        </div>
      )}
      {!showOthers && (
        <>
          <Modal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          >
            <Modal.Backdrop />
            <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
              <StoryForm
                type="create"
                onSucceed={handleCreateSuccess}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </Modal.Panel>
          </Modal>
          <Modal
            open={isFirstBookModalOpen}
            onClose={() => setIsFirstBookModalOpen(false)}
          >
            <Modal.Backdrop />
            <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
              <FirstBookCreatedModal onClose={() => setIsFirstBookModalOpen(false)} />
            </Modal.Panel>
          </Modal>
        </>
      )}
    </div>
  );
}
