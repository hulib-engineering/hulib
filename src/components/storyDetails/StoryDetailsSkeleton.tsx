import React from 'react';

const StoryDetailsSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-screen-sm px-4 lg:max-w-screen-2xl lg:px-28">
      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-4 lg:flex-row">
        {/* Left Panel */}
        <div className="flex-1">
          <div className="h-72 w-full animate-pulse rounded-md bg-gray-300" />
        </div>

        {/* Center Panel */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-300" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
        </div>

        {/* Right Panel */}
        <div className="flex-1">
          <div className="flex h-full flex-col gap-4 rounded-md bg-white p-4 shadow-md">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailsSkeleton;
