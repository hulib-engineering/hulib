'use client';

import {
  CaretDown,
  CaretUp,
  DotsThreeVertical,
  Heart,
} from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

import { useGetReviewsByStoryQuery } from '@/libs/services/modules/stories';
import type { StoryReview } from '@/libs/services/modules/stories/storiesType';

import IconButton from '../iconButton/IconButton';

const ReviewItem = (params: StoryReview) => {
  return (
    <div className="flex flex-col gap-y-2 p-2">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-x-2">
          <Image
            src={params?.user?.photo?.path || '/assets/images/user-avatar.jpeg'}
            alt="Avatar"
            width={44}
            height={44}
            priority
            className="rounded-full border-4 border-neutral-98 object-contain object-center"
          />
          <div className="flex flex-col">
            <p className="text-sm font-normal text-[#000000]">
              {params?.user?.fullName || ''}
            </p>
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-0.5">
                {[...Array(5)].map((_, index) => (
                  <Heart
                    key={`heart-${params.id}-${index}`}
                    size={16}
                    color={
                      index < Math.floor(params.rating) ? '#F3C00C' : '#E0E0E0'
                    }
                    weight="fill"
                  />
                ))}
              </div>
              <p className="text-xs text-[#00000080]">
                {params?.createdAt
                  ? new Date(params.createdAt).toLocaleDateString()
                  : ''}
              </p>
            </div>
          </div>
        </div>
        <DotsThreeVertical size={16} color="#00000080" />
      </div>
      <div className=" flex flex-col gap-y-2">
        <p className="text-base font-normal text-[#000000]">
          {params?.title || ''}
        </p>
        <p className="text-sm font-normal text-[#000000]">
          {params?.comment || ''}
        </p>
      </div>
    </div>
  );
};

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
