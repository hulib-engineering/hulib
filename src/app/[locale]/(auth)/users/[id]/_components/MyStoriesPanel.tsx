'use client';

import { useState } from 'react';
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

type TTopic = {
  userId: number;
  topicId: number;
  topic: Topic;
};

type MyStoriesPanelProps = {
  storyOwnerId: number;
  topics: TTopic[];
  showOthers?: boolean;
};

export default function MyStoriesPanel({ storyOwnerId, showOthers = false }: MyStoriesPanelProps) {
  const { data: stories, isLoading } = useGetHuberStoriesQuery(
    { huberId: storyOwnerId, publishedOnly: showOthers },
    { skip: !storyOwnerId },
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFirstBookModalOpen, setIsFirstBookModalOpen] = useState(false);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setIsFirstBookModalOpen(true);
  };

  const isEmpty = !stories?.data?.length;

  const renderContent = () => {
    if (isLoading) {
      return <StoriesSkeleton />;
    }
    if (isEmpty && showOthers) {
      return <StoriesOthersEmptyState />;
    }
    if (isEmpty) {
      return <MyStoriesEmptyState onCreateClick={() => setIsCreateModalOpen(true)} />;
    }

    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {!showOthers && <CreateStoryCard onClick={() => setIsCreateModalOpen(true)} className="w-full max-w-none" />}
          {stories?.data?.map((story: TStory) => (
            showOthers
              ? <StoryCard key={story.id} data={story} />
              : <MyStoryCard key={story.id} data={story} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-5 lg:px-0">
      {renderContent()}
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
