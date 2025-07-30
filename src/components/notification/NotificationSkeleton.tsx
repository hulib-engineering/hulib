import type { FC } from 'react';

type NotificationSkeletonProps = {
  count?: number;
};

const NotificationSkeleton: FC<NotificationSkeletonProps> = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border-b p-3 last:border-b-0 ">
          <div className="flex items-start gap-2">
            <div className="relative shrink-0">
              <div className="size-14 rounded-full bg-gray-200" />
              {index % 2 === 0 && (
                <div className="absolute bottom-0 right-0 size-6 rounded-sm bg-gray-300" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 space-y-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                  {index % 3 === 0 && (
                    <div className="mb-2 h-3 w-16 rounded bg-gray-200" />
                  )}
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  {index % 3 === 0 && (
                    <div className="mt-2 flex gap-2">
                      <div className="h-8 flex-1 rounded-full bg-gray-200" />
                      <div className="h-8 flex-1 rounded-full bg-gray-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationSkeleton;
