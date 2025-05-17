import React from 'react';

import Button from '@/components/button/Button';
import { FlipBook } from '@/components/flipBook/FlipBook';
import Modal from '@/components/Modal';
import { mergeClassnames } from '@/components/private/utils';
import type { Story } from '@/libs/services/modules/stories/storiesType';

type DeleteStoryModalProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  story: Story;
};

const DeleteStoryModal: React.FC<DeleteStoryModalProps> = ({
  open,
  onClose,
  onDelete,
  story,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {/* Panel: Centered, rounded, shadow, max width */}
      <Modal.Panel
        className={mergeClassnames('max-w-lg w-full p-0 rounded-3xl')}
      >
        {/* Modal Content Wrapper */}
        <div className="flex flex-col items-center justify-center p-8">
          {/* Title: Large, bold, centered */}
          <h4 className="mb-6 text-center text-2xl font-medium">
            Are you sure you want to delete this story?
          </h4>

          <div className="pointer-events-none rounded-2xl shadow-md">
            <FlipBook data={story} renderActions={() => null} />
          </div>

          {/* Warning Text */}
          <div className="my-4 text-center text-sm font-medium text-red-600">
            This story will be deleted immediately.
            <br />
            <span className="font-normal text-gray-500">
              You can&apos;t undo this action.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full max-w-md flex-row gap-4">
            <Button variant="outline" className="h-12 flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="h-12 flex-1"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default DeleteStoryModal;
