'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Trash } from '@phosphor-icons/react';
import React from 'react';

import Button from '@/components/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import { useAppSelector } from '@/libs/hooks';
import {
  useDeleteStoryMutation,
  useGetStoriesQuery,
} from '@/libs/services/modules/stories';
import { Role } from '@/types/common';

import CreateStoryModal from './CreateStoryModal';
import DeleteStoryModal from './DeleteStoryModal';

const StoriesTab = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const isHuber = userInfo?.role?.id === Role.HUBER;
  const [deleteStory] = useDeleteStoryMutation();
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
  const [editingStory, setEditingStory] = React.useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [storyToDelete, setStoryToDelete] = React.useState<any>(null);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingStory(null);
    // Refetch stories after modal is closed (which means story was created/edited successfully)
    refetch();
  };

  const handleEditStory = (story: any) => {
    setEditingStory(story);
    setIsCreateModalOpen(true);
  };

  const handleDeleteStory = async (story: any) => {
    try {
      await deleteStory({ id: story.id }).unwrap();
      setIsDeleteModalOpen(false);
      pushSuccess('Story deleted successfully');
      refetch();
    } catch (error) {
      pushError('Error deleting story');
    }
  };

  const renderActions = (story: any) => {
    return (
      <div
        className={mergeClassnames(
          'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px]',
          'md:flex-row md:mt-2 md:px-3 md:pl-0',
        )}
      >
        <Button
          variant="primary"
          className={mergeClassnames(
            'text-base h-8 max-h-8 w-[120px] flex-none rounded-full px-[12px] py-[12px]',
            'md:h-[44px] md:max-h-[44px] md:w-[105px]',
          )}
          onClick={() => handleEditStory(story)}
        >
          Editing
        </Button>
        <Button
          variant="outline"
          className={mergeClassnames(
            'w-full h-8',
            'md:size-10 md:min-h-10 md:min-w-10',
          )}
          iconOnly
          onClick={() => {
            setStoryToDelete(story);
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash size={20} />
        </Button>
      </div>
    );
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
              <FlipBook
                key={story?.id}
                data={story}
                renderActions={() => renderActions(story)}
                refetch={refetch}
              />
            ))
          : null}
      </div>

      <CreateStoryModal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        editingStory={editingStory}
      />

      {storyToDelete && (
        <DeleteStoryModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => handleDeleteStory(storyToDelete)}
          story={storyToDelete}
        />
      )}
    </div>
  );
};

export default StoriesTab;
