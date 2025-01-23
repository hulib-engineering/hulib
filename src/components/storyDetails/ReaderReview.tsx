'use client';

import { CaretDown, CaretUp } from '@phosphor-icons/react';
import * as React from 'react';

import { useGetReviewsByStoryQuery } from '@/libs/services/modules/stories';

import IconButton from '../iconButton/IconButton';
import ReviewItem from './ReviewItem';

interface ReaderReviewProps {
  id: number;
}

const ReaderReview = ({ id }: ReaderReviewProps) => {
  const { data, isLoading } = useGetReviewsByStoryQuery({
    id,
  });

  const [isExpanded, setIsExpanded] = React.useState(false);
  const REVIEWS_SHOW = 4;

  if (isLoading) return null;

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border border-solid p-6 shadow-[0px_0px_4px_0px_#0F0F100F]">
      <h6 className="text-xl font-bold text-neutral-20">{`Reader reviews (${
        data?.data?.length || 0
      })`}</h6>
      <div className="flex flex-col gap-y-4">
        {data?.data
          ?.slice(0, !isExpanded ? REVIEWS_SHOW : data?.data?.length)
          .map((review: any) => <ReviewItem key={review.id} {...review} />)}
      </div>
      {data?.data?.length > REVIEWS_SHOW && (
        <div className="flex justify-center">
          <IconButton
            className="w-fit text-sm text-primary-50"
            onClick={() => setIsExpanded(!isExpanded)}
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
