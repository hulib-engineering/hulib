'use client';

import React, { useEffect, useRef, useState } from 'react';

import StoryReviews from './StoryReviews';
import RatingOverview from './RatingOverview';

export default function StoryReviewsWithOverview() {
  const ratingOverviewRef = useRef<HTMLDivElement>(null);

  const [ratingOverviewSectionHeight, setRatingOverviewSectionHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!ratingOverviewRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setRatingOverviewSectionHeight(entry.contentRect.height);
      }
    });

    observer.observe(ratingOverviewRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid w-full items-start gap-4 lg:grid-cols-3 lg:gap-6">
      <div
        className="order-last lg:order-first lg:col-span-2"
        // style={{ maxHeight: ratingOverviewSectionHeight }}
      >
        <div className="hidden lg:block">
          <StoryReviews maxHeight={ratingOverviewSectionHeight} />
        </div>
        <div className="lg:hidden">
          <StoryReviews maxHeight={0} />
        </div>
      </div>

      <div ref={ratingOverviewRef} className="order-first lg:order-last">
        <RatingOverview />
      </div>
    </div>
  );
}
