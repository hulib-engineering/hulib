'use client';

import { StoryCard } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/StoryCard';
import type { Story as TStory } from '@/libs/services/modules/stories/storiesType';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';

type MyStoryCardProps = {
  data: TStory;
};

type CardStatus = 'in_review' | 'rejected' | 'approved';

function getCardStatus(publishStatus: StoryPublishStatus): CardStatus {
  if (publishStatus === StoryPublishStatus.PUBLISHED) {
    return 'approved';
  }
  if (publishStatus === StoryPublishStatus.REJECTED) {
    return 'rejected';
  }
  return 'in_review';
}

export default function MyStoryCard({ data }: MyStoryCardProps) {
  const cardStatus = getCardStatus(data.publishStatus);

  return (
    <div className="relative w-full overflow-hidden rounded-[20px] border border-lavender-80 bg-white">
      {cardStatus !== 'approved' && <div className="absolute right-0 top-0 z-10 size-full bg-[#FAF7FC] opacity-50" />}
      <StoryCard
        outletClassName="max-w-none"
        data={data}
        isShowFavorite={false}
        isShowStoryBage={data.publishStatus !== StoryPublishStatus.PUBLISHED}
        isShowReadAll={data.publishStatus === StoryPublishStatus.PUBLISHED}
      />
    </div>
  );
}
