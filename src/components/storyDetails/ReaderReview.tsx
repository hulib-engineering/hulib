'use client';

import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { cloneDeep } from 'lodash';
import * as React from 'react';

import { useGetStoryReviewsByStoryIdQuery } from '@/libs/services/modules/story-reviews';

import IconButton from '../iconButton/IconButton';
import ReviewItem from './ReviewItem';

interface ReaderReviewProps {
  storyId: number;
}

const SHOW_LIMIT_REVIEWS = 5;

const ReaderReview = ({ storyId }: ReaderReviewProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const { data: storyReviewsData, isLoading } =
    useGetStoryReviewsByStoryIdQuery({ storyId, limit: 200 });

  const onClickViewAllReviews = () => {
    setIsExpanded((prev) => !prev);
  };

  if (isLoading) return null;

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border border-solid p-6 shadow-[0px_0px_4px_0px_#0F0F100F]">
      <h6 className="text-xl font-bold text-neutral-20">{`Reader reviews (${
        storyReviewsData?.data?.length || 0
      })`}</h6>
      {storyReviewsData?.data.length === 0 ? (
        <p className="text-center text-base">Chưa có bình luận nào</p>
      ) : (
        <div className="flex max-h-[560px] flex-col gap-y-4 overflow-auto">
          {cloneDeep(storyReviewsData?.data)
            ?.slice(
              0,
              !isExpanded ? SHOW_LIMIT_REVIEWS : storyReviewsData?.data?.length,
            )
            .map((review: any) => <ReviewItem key={review.id} {...review} />)}
        </div>
      )}
      {storyReviewsData?.data.length > SHOW_LIMIT_REVIEWS && (
        <div className="flex justify-center">
          <IconButton
            className="w-fit text-sm text-primary-50"
            onClick={onClickViewAllReviews}
            tabIndex={0}
            variant="ghost"
            icon={
              !isExpanded ? (
                <CaretDown size={16} color="#0442BF" />
              ) : (
                <CaretUp size={16} color="#0442BF" />
              )
            }
          >
            {isExpanded ? 'Show less' : 'View all reviews'}
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ReaderReview;
