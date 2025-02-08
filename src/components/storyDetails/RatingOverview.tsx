'use client';

import { Heart } from '@phosphor-icons/react';
import * as React from 'react';

import { useGetReviewsOverviewQuery } from '@/libs/services/modules/stories';

import ReviewItem from './ReviewItem';

const RateScore = ({ score, reviews }: { score: string; reviews: number }) => {
  const scoreNumber = parseFloat(score);
  return (
    <div className="flex items-center gap-x-2 py-4">
      {scoreNumber > 0 && <h6>{scoreNumber.toFixed(1)}</h6>}
      <div className="flex items-center gap-x-0.5">
        <Heart size={24} color="#F3C00C" weight="fill" />
        <Heart size={24} color="#F3C00C" weight="fill" />
        <Heart size={24} color="#F3C00C" weight="fill" />
        <Heart size={24} color="#F3C00C" weight="fill" />
        <Heart size={24} color="#E3E4E5" weight="fill" />
      </div>
      <p className="text-xs text-[#00000080]">{reviews} reviews</p>
    </div>
  );
};

const RateChartItem = ({
  score,
  percentage,
}: {
  score: number;
  percentage: number;
}) => {
  return (
    <div className="flex items-center gap-x-3">
      <div className="flex items-center gap-x-2">
        <p className="text-xs text-[#00000080]">{score}</p>
        <Heart size={16} color="#F3C00C" weight="fill" />
      </div>
      <div className="h-5 w-full bg-neutral-90">
        <div
          className="h-full bg-[#F3C00C]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm">{percentage}%</p>
    </div>
  );
};

const RateChart = ({ histogram }: any) => {
  return (
    <div className="flex flex-col gap-y-2">
      {histogram?.map((rate: any) => (
        <RateChartItem
          key={`${rate?.rating}-${rate?.numberOfReviews}`}
          score={rate?.rating}
          percentage={rate?.numberOfReviews}
        />
      ))}
    </div>
  );
};

export interface Props {
  id: number;
}

const RatingOverview = ({ id }: Props) => {
  const { data, isLoading } = useGetReviewsOverviewQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl border border-solid p-6 shadow-[0px_0px_4px_0px_#0F0F100F] md:w-1/4">
      <h6 className="text-xl font-bold text-neutral-20">Rating overview</h6>
      <RateScore score={data?.rating} reviews={data?.numberOfReviews} />
      <RateChart histogram={data?.histogram} />
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
      <div className="flex flex-col gap-y-2">
        <p>Outstanding review</p>
        <ReviewItem {...data?.outStanding} />
      </div>
    </div>
  );
};

export default RatingOverview;
