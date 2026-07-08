'use client';

import Loading from '@/components/loadingState/_loadingAnimationPicker';

export default function _Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Loading />
    </div>
  );
}
