import { Heart } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { z } from 'zod';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import TextArea from '@/components/core/textArea/TextArea';
import { Cover } from '@/components/Cover';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { ApprovalModalLayout } from '@/layouts/admin/ApprovalModalLayout';
import { TopicChip } from '@/layouts/webapp/ChipFilter';
import { useUpdateStoryMutation } from '@/libs/services/modules/stories';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import type { ProfileValidation } from '@/validations/ProfileValidation';
import type { StoriesValidation } from '@/validations/StoriesValidation';

type IApprovalConfirmationModalProps = {
  story: Omit<z.infer<typeof StoriesValidation>, 'cover' | 'topics'> & {
    id: number;
    humanBook: z.infer<typeof ProfileValidation> & { photo?: { id: string; path: string } };
    storyReviews?: {
      rating: number;
      numberOfRatings: number;
    };
    cover: {
      path: string;
    };
    topics: Topic[];
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
    router.push('/admin/home');
  };

  return (
    <ApprovalModalLayout open={open} onClose={onClose} type={type}>
      <div className={mergeClassnames('rounded-lg p-6', type === 'approve' ? 'bg-neutral-98' : 'bg-red-98')}>
        <div className="flex items-center rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-64 flex-1 flex-col justify-center pr-4 pt-2">
            <div className="flex flex-col gap-2">
              <h6 className="text-xl font-medium text-primary-10">{story.title}</h6>
              <div className="flex gap-2 overflow-x-auto scroll-smooth py-1">
                {story?.topics.map((topic: Topic) => (
                  <TopicChip
                    className="h-[22px] border-none bg-blue-90 text-primary-50 lg:text-xs"
                    key={topic.id}
                    isActive
                  >
                    {topic.name}
                  </TopicChip>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                <Avatar className="!size-[14px]" size="xs" imageUrl={story.humanBook.photo?.path} />
                <p className="line-clamp-1 text-neutral-50">{story.humanBook.fullName}</p>
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
            ? isSuccessful ? 'You have confirmed the request to publish this story.' : 'You are accepting the request to publish this story.'
            : isSuccessful ? 'You declined the request to publish this story.' : 'You are declining the request to publish this story.'}
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
