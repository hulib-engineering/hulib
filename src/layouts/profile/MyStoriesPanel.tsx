'use client';

import { Plus } from '@phosphor-icons/react';
import React, { useState } from 'react';

import Image from 'next/image';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/common/chip/Chip';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoryCard } from '@/components/stories/StoryCard';
import { useGetHuberStoriesQuery } from '@/libs/services/modules/huber';
import type { Topic } from '@/libs/services/modules/user/userType';
import Modal from '@/components/Modal';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { StoriesSkeleton } from '@/components/stories/StoriesSkeleton';
import StoryForm from '@/layouts/stories/StoryForm';

type TTopic = {
  userId: number;
  topicId: number;
  topic: Topic;
};
type IMyStoriesPanelProps = {
  storyOwnerId: number;
  topics: TTopic[];
  showOthers?: boolean;
};

export default function MyStoriesPanel({ topics, storyOwnerId, showOthers = false }: IMyStoriesPanelProps) {
  const {
    data: stories,
    isLoading,
  } = useGetHuberStoriesQuery(
    {
      huberId: storyOwnerId,
      publishedOnly: showOthers,
    },
    {
      skip: !storyOwnerId,
    },
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>(topics.map(topic => topic.topicId));

  const handleTopicChipClick = (topicId: number) => {
    if (selectedTopicIds.length === topics.length) {
      // All is currently selected → reset and select only clicked one
      setSelectedTopicIds([topicId]);
    } else {
      // Toggle this chip
      if (selectedTopicIds.includes(topicId)) {
        setSelectedTopicIds(selectedTopicIds.filter(id => id !== topicId));
      } else {
        setSelectedTopicIds([...selectedTopicIds, topicId]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-5 lg:px-0">
        <StoriesSkeleton />
      </div>
    );
  }

  if (showOthers && stories && stories.data && stories.data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-5 lg:px-0">
        <Image
          src="/assets/images/no-results-found.png"
          className="h-[312px] w-[398px] object-contain lg:h-[378px] lg:w-[482px]"
          width={482}
          height={378}
          quality={100}
          alt="No results found"
        />
        <div className="flex flex-col gap-2 text-center text-primary-10">
          <h5 className="text-2xl font-bold capitalize leading-8">
            No stories found
          </h5>
          <p>It seems like Huber has not finished any stories yet. </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-5 lg:px-0">
      <h2 className="text-2xl font-medium text-primary-10 lg:px-0 lg:text-4xl lg:leading-[44px]">Library</h2>
      <div className="flex items-center gap-2 py-1 lg:px-0">
        <Chip
          className={mergeClassnames(
            'overflow-visible h-full w-fit min-w-[46px] rounded-2xl  p-2 text-sm font-medium leading-4',
            selectedTopicIds.length === topics.length
              ? 'border border-primary-80 bg-primary-90 text-primary-60' : 'bg-neutral-90 text-neutral-20',
          )}
          onClick={() => selectedTopicIds.length === topics.length
            ? setSelectedTopicIds([]) : setSelectedTopicIds(topics.map(topic => topic.topicId))}
        >
          All
        </Chip>
        {topics?.map(topic => (
          <Chip
            key={topic.topicId}
            className={mergeClassnames(
              'h-full w-fit min-w-[46px] rounded-2xl  p-2 text-sm font-medium leading-4',
              selectedTopicIds.length < topics.length && selectedTopicIds.includes(topic?.topicId)
                ? 'border border-primary-80 bg-primary-90 text-primary-60' : 'bg-neutral-90 text-neutral-20',
            )}
            onClick={() => handleTopicChipClick(topic.topicId)}
          >
            {topic?.topic?.name}
          </Chip>
        ))}
      </div>
      <div
        className={mergeClassnames(
          'grid grid-cols-1 gap-8',
          'md:grid-cols-2 gap-4',
          'xl:grid-cols-3',
        )}
      >
        {!showOthers && (
          <div
            className="flex size-full min-h-[287px] max-w-[392px] items-center justify-center rounded-[20px] border border-neutral-80 bg-white"
          >
            <div className="flex flex-col items-center gap-6">
              <IconButton
                variant="secondary"
                size="lg"
                className="!h-[68px] w-[68px]"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-primary-60">
                  <Plus className="text-xl text-white" />
                </div>
              </IconButton>
              <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
                Create New Story
              </Button>
            </div>
          </div>
        )}
        {stories && stories?.data?.map((story: TStory) => (
          <StoryCard
            key={story?.id}
            data={story}
            editable
          />
        ))}
      </div>
      <Modal
        open={isCreateModalOpen}
        disableClosingTrigger
        onClose={() => setIsCreateModalOpen(false)}
      >
        <Modal.Backdrop />
        <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
          <StoryForm
            type="create"
            onSucceed={() => setIsCreateModalOpen(false)}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal.Panel>
      </Modal>
    </div>
  );
};
