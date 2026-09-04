'use client';

import CommentSection from './CommentSection';
import { DetailedStory } from '@/features/stories/components/DetailedStory';

type StoryContentProps = {
  abstract: string;
  bookWidth?: number;
};

type CommentProps = {
  storyId: number;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
};

export default function StoryContent({ abstract, bookWidth, storyId, comment, setComment }: StoryContentProps & CommentProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-y-8 lg:w-[888px] lg:max-w-[888px]">
      <DetailedStory
        abstract={abstract}
        bookWidth={bookWidth}
      />
      <div className="max-lg:hidden">
        <CommentSection storyId={storyId} comment={comment} setComment={setComment} />
      </div>
    </div>
  );
}
