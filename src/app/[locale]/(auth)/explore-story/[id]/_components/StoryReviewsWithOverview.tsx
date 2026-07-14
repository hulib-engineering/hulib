'use client';

import React, { useRef } from 'react';

import RatingOverview from './RatingOverview';
import StoryReviews from './StoryReviews';

export default function StoryReviewsWithOverview() {
  const ratingOverviewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="grid w-full items-start gap-4 lg:grid-cols-3 lg:gap-6">
      <div
        className="order-last lg:order-first lg:col-span-2"
        // style={{ maxHeight: ratingOverviewSectionHeight }}
      >
        <div className="hidden lg:block">
          <StoryReviews />
        </div>
        <div className="lg:hidden">
          <StoryReviews />
        </div>
      </div>

      <div ref={ratingOverviewRef} className="order-first lg:order-last">
        <RatingOverview />
      </div>
    </div>
  );
}
