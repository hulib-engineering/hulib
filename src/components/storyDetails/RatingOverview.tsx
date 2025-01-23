'use client';

import { Brain, DotsThreeVertical, Heart } from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';

const RateScore = ({ score, reviews }: { score: string; reviews: number }) => {
  const scoreNumber = parseFloat(score);
  return (
    <div className="flex items-center gap-x-2 py-4">
      <h6>{scoreNumber.toFixed(1)}</h6>
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
      <p>{percentage}%</p>
    </div>
  );
};

const RateChart = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <RateChartItem score={5} percentage={100} />
      <RateChartItem score={4} percentage={90} />
      <RateChartItem score={3} percentage={88} />
      <RateChartItem score={2} percentage={20} />
      <RateChartItem score={1} percentage={13} />
    </div>
  );
};

const ReviewItem = () => {
  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-x-2">
          <Image
            src="/assets/images/user-avatar.jpeg"
            alt="Avatar"
            width={44}
            height={44}
            priority
            className="rounded-full border-4 border-neutral-98 object-contain object-center"
          />
          <div className="flex flex-col">
            <p className="text-sm font-normal text-[#000000]">Ngo Thanh Nhan</p>
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-x-0.5">
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
                <Heart size={16} color="#F3C00C" weight="fill" />
              </div>
              <p className="text-xs text-[#00000080]">25/03/1999</p>
            </div>
          </div>
        </div>
        <DotsThreeVertical size={16} color="#00000080" />
      </div>
      <div className=" flex flex-col gap-y-2">
        <p className="text-base font-normal text-[#000000]">Give it a read</p>
        <p className="text-sm font-normal text-[#000000]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
      </div>
    </div>
  );
};

const RatingOverview = () => {
  return (
    <div className="flex w-fit flex-col gap-4 rounded-3xl border border-solid p-6 shadow-[0px_0px_4px_0px_#0F0F100F]">
      <h6 className="text-xl font-bold text-neutral-20">Rating overview</h6>
      <RateScore score="4.2" reviews={125} />
      <RateChart />
      <div className="flex flex-col gap-y-2">
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
      </div>
      <div className="flex flex-col gap-y-2">
        <p>Outstanding review</p>
        <ReviewItem />
      </div>
    </div>
  );
};

export default RatingOverview;
