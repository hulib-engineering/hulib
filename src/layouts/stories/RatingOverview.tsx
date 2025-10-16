'use client';

import { Heart } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import * as React from 'react';

import { ReviewItem } from './StoryReviews';

import { mergeClassnames } from '@/components/core/private/utils';
import { useGetReviewsOverviewQuery } from '@/libs/services/modules/stories';

export default function RatingOverview() {
  const { id } = useParams();

  const { data } = useGetReviewsOverviewQuery(id);

  return (
    <div className="flex w-full flex-col gap-2 rounded-none bg-white p-5 shadow-sm lg:gap-4 lg:rounded-2xl lg:p-6">
      <h6 className="text-xl font-medium leading-7 text-neutral-20 lg:font-bold">Rating overview</h6>
      <div className="flex items-center gap-3 py-4">
        <h2 className="text-lg font-medium text-neutral-20 lg:text-4xl lg:leading-[44px]">{data?.rating}</h2>
        <div className="ml-1 flex justify-center">
          {[...Array(5)].map((_, index) => {
            const isActive = index < data?.rating;

            return (
              <Heart
                key={index}
                weight="fill"
                className={mergeClassnames(
                  'text-2xl',
                  isActive ? 'text-yellow-50' : 'text-neutral-90',
                )}
              />
            );
          },
          )}
        </div>
        <p className="text-xs leading-[14px] text-opacity-50">
          {`${data?.numberOfReviews || 0} reviews`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => {
          const percentage = data?.histogram ? data?.histogram[index]?.count / data?.numberOfReviews * 100 : 0;

          return (
            <div key={index} className="grid grid-cols-[28px_1fr_auto] items-center gap-[14px] font-medium leading-5 text-opacity-50">
              <div className="flex items-center justify-between">
                <p>{5 - index}</p>
                <Heart weight="fill" className="text-yellow-50" />
              </div>
              <div className="h-5 w-full bg-neutral-90">
                <div
                  className="h-full bg-yellow-50"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p>{`${percentage}%`}</p>
            </div>
          );
        },
        )}
      </div>

      {/* <div className="flex flex-col gap-y-2">
        <p>Areas consulted</p>
        <div
          className="flex w-fit cursor-pointer items-center justify-center gap-x-2 rounded-full bg-primary-50 px-3 py-2"
          role="button"
          tabIndex={0}
        >
          <Brain size={16} color="#FFFFFF" />
          <span className="text-sm font-medium text-primary-98">
            Productivity
          </span>
        </div>
      </div> */}
      {data?.outStanding && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium leading-5">Outstanding review</p>
          <ReviewItem {...data?.outStanding} />
        </div>
      )}
    </div>
  );
};
