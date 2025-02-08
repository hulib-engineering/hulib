import { DotsThreeVertical, Heart } from '@phosphor-icons/react';
import Image from 'next/image';

import type { StoryReview } from '@/libs/services/modules/story-reviews/storyReviewsType';

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
                    key={`heart-${params?.id}`}
                    size={16}
                    color={
                      index < Math.floor(params?.rating ?? 0)
                        ? '#F3C00C'
                        : '#E0E0E0'
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

export default ReviewItem;
