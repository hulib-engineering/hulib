import { Heart } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { z } from 'zod';

import { mergeClassnames } from '@/components/private/utils';
import Avatar from '@/components/avatar/Avatar';
import Button from '@/components/button/Button';
import { Chip } from '@/components/common/chip/Chip';
import { Cover } from '@/components/Cover';
import TextArea from '@/components/textArea/TextArea';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { ApprovalModalLayout } from '@/layouts/admin/ApprovalModalLayout';
import { useUpdateStoryMutation } from '@/libs/services/modules/stories';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';
import type { ProfileValidation } from '@/validations/ProfileValidation';
import type { StoriesValidation } from '@/validations/StoriesValidation';

type IApprovalConfirmationModalProps = {
  story: z.infer<typeof StoriesValidation> & {
    id: number;
    humanBook: z.infer<typeof ProfileValidation> & { photo?: { id: string; path: string } };
    storyReviews?: {
      rating: number;
      numberOfRatings: number;
    };
  };
  type: 'approve' | 'reject';
  open: boolean;
  onClose: () => void;
};

export default function StoryConfirmationModal({
  story,
  type,
  open,
  onClose,
}: IApprovalConfirmationModalProps) {
  const router = useRouter();

  const [updateStory, { isLoading }] = useUpdateStoryMutation();

  const [rejectionReason, setRejectionReason] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleUpdateStoryStatus = async () => {
    try {
      await updateStory({
        id: Number(story.id),
        ...type === 'approve'
          ? { publishStatus: StoryPublishStatus.PUBLISHED }
          : { publishStatus: StoryPublishStatus.REJECTED, rejectionReason },
      }).unwrap();
      pushSuccess(
        type === 'approve'
          ? 'Story approved successfully'
          : 'Story rejected successfully',
      );
      setIsSuccessful(true);
    } catch (error) {
      pushError('Failed to approve story');
    }
  };
  const handleDoneConfirmation = () => {
    onClose();
    setIsSuccessful(false);
    setRejectionReason('');
    router.push('/admin/stories/approval');
  };

  return (
    <ApprovalModalLayout open={open} onClose={onClose} type={type}>
      <div className={mergeClassnames('rounded-lg p-6', type === 'approve' ? 'bg-neutral-98' : 'bg-red-98')}>
        <div className="flex items-center rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-64 flex-1 flex-col justify-center pr-4 pt-2">
            <div className="flex flex-col gap-2">
              <h6 className="text-xl font-medium text-primary-10">{story.title}</h6>
              <Chip className="w-fit rounded-2xl bg-blue-90 px-2 py-1 text-xs leading-[14px] text-primary-50">Productivity</Chip>
              <div className="flex items-center gap-1 text-xs font-medium">
                <Avatar className="!size-[14px]" size="xs" imageUrl={story.humanBook.photo?.path} />
                <p className="text-red-50">[Huber]</p>
                <p className="text-neutral-50">{story.humanBook.fullName}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Heart weight="fill" className="text-yellow-50" />
                  <p className="text-sm font-medium">{story.storyReviews?.rating ?? 0}</p>
                </div>
                <p className="text-xs text-neutral-40">{`(${story.storyReviews?.numberOfRatings ?? 0} ratings)`}</p>
              </div>
            </div>
          </div>
          <Cover
            coverUrl={story.cover?.path}
            title={story.title}
            authorName={story.humanBook.fullName}
            className="flex-1"
          />
        </div>

      </div>
      {type === 'reject' && !isSuccessful && (
        <TextArea
          rows={7}
          placeholder="Reason for rejection"
          value={rejectionReason}
          onChange={e => setRejectionReason(e.target.value)}
        />
      )}
      <div className="flex w-full flex-col gap-3">
        <p className={mergeClassnames('text-center text-sm', (type === 'approve' || isSuccessful) ? 'text-neutral-30' : 'text-red-70')}>
          {type === 'approve'
            ? isSuccessful ? 'You have confirmed the request to become a Huber.' : 'You are accepting the request to become a Huber.'
            : isSuccessful ? 'You declined the request to become a Huber.' : 'You are declining the request to become a Huber.'}
        </p>
        {isSuccessful ? (
          <Button
            size="lg"
            fullWidth
            onClick={handleDoneConfirmation}
          >
            Homepage
          </Button>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Button variant="outline" size="lg" fullWidth onClick={onClose}>Back</Button>
            <Button
              size="lg"
              fullWidth
              disabled={isLoading}
              animation={isLoading && 'progress'}
              onClick={handleUpdateStoryStatus}
            >
              Confirm
            </Button>
          </div>
        )}
      </div>
    </ApprovalModalLayout>
  );
}
