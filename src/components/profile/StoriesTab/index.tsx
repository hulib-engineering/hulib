'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Button from '@/components/button/Button';
import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import { Role } from '@/types/common';

import CreateStoryModal from './CreateStoryModal';

const StoriesTab = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const isHuber = userInfo?.role?.id === Role.HUBER;
  const {
    data: stories,
    isLoading,
    refetch,
  } = useGetStoriesQuery(
    {
      humanBookId: isHuber ? Number(userInfo?.id) : undefined,
    },
    {
      skip: !isHuber && !userInfo?.id,
    },
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    // Refetch stories after modal is closed (which means story was created successfully)
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-primary-10">Library</h2>
      <div
        className={mergeClassnames(
          'grid grid-cols-1 gap-8',
          'md:grid-cols-2 gap-y-4',
          'xl:grid-cols-3',
        )}
      >
        <div className="flex h-[287px] w-[392px] flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-98">
            <PlusIcon className="h-8 w-8 text-primary-60" />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create New Story
          </Button>
        </div>
        {stories?.data?.length > 0
          ? stories?.data?.map((story: any) => (
              <FlipBook key={story?.id} data={story} />
            ))
          : null}
      </div>

      <CreateStoryModal open={isCreateModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default StoriesTab;
