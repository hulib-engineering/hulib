'use client';

import { AnimationLoading } from '@/components/AnimationLoading';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <AnimationLoading
        animationData="/assets/animations/book.json"
        width="300px"
        height="300px"
      />
    </div>
  );
}
