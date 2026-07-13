// MyBook.tsx
'use client';

import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';

type Props = {
  topics: any;
  storyOwnerId: number;
  showOthers: boolean;
};

export default function MyBook({
  topics,
  storyOwnerId,
  showOthers,
}: Props) {
  return (
    <MyStoriesPanel
      topics={topics}
      storyOwnerId={storyOwnerId}
      showOthers={showOthers}
    />
  );
}
