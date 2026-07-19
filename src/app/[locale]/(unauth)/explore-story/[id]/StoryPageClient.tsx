'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { useRouter } from '@/libs/i18nNavigation';

import Button from '@/components/core/button/Button';
import { IndexStoryListSectionLayout } from '@/components/home/IndexStoryListCommonLayout';
import {
  useGetSimilarStoriesQuery,
} from '@/libs/services/modules/stories';

import StorySidePanel from '@/app/[locale]/(auth)/explore-story/[id]/_components/StorySidePanel';
import StoryContent from '@/app/[locale]/(auth)/explore-story/[id]/_components/StoryContent';
import type { Story } from '@/libs/services/modules/stories/storiesType';

type Props = {
  initialData: Story;
  storyId: number;
};

export default function StoryPageClient({ initialData, storyId }: Props) {
  const router = useRouter();
  const storyLayoutRef = React.useRef<HTMLDivElement>(null);
  const sidePanelRef = React.useRef<HTMLDivElement>(null);

  const t = useTranslations('ExploreStory');

  const humanBookId = (initialData as any)?.humanBookId;
  const topics = initialData?.topics;

  const topicIds = React.useMemo(
    () => topics?.map((topic: { id: number }) => topic.id) ?? [],
    [topics],
  );

  const { data: similarStories } = useGetSimilarStoriesQuery({
    page: 1,
    limit: 6,
    humanBookId,
    topicIds,
  }, {
    skip: !humanBookId && !topics?.length,
  });

  const [bookWidth, setBookWidth] = React.useState<number>();

  const slicedStories = React.useMemo(
    () => similarStories?.data?.slice(0, 5) || [],
    [similarStories?.data],
  );

  const storiesProps = React.useMemo(
    () => ({ ...similarStories, data: slicedStories }),
    [similarStories, slicedStories],
  );

  const handleBack = React.useCallback(() => {
    router.push('/');
  }, [router]);

  const handleSeeAllClick = React.useCallback(() => {
    router.push('/explore-story');
  }, [router]);

  React.useEffect(() => {
    const updateBookWidth = () => {
      if (!storyLayoutRef.current || !sidePanelRef.current) {
        return;
      }

      const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
      if (!isDesktop) {
        setBookWidth((prev) => {
          if (prev === undefined) {
            return prev;
          }
          return undefined;
        });
        return;
      }

      const layoutRect = storyLayoutRef.current.getBoundingClientRect();
      const sidePanelRect = sidePanelRef.current.getBoundingClientRect();
      const computedLayoutStyles = window.getComputedStyle(storyLayoutRef.current);
      const gap = Number.parseFloat(computedLayoutStyles.columnGap || computedLayoutStyles.gap || '0');
      const leftPadding = layoutRect.left;
      const rightPadding = window.innerWidth - layoutRect.right;
      const computedBookWidth = window.innerWidth - leftPadding - rightPadding - sidePanelRect.width - gap;
      const isWideDesktop = window.matchMedia('(min-width: 1440px)').matches;
      const cappedBookWidth = isWideDesktop ? Math.min(computedBookWidth, 888) : computedBookWidth;
      const newWidth = Math.max(cappedBookWidth, 0);

      setBookWidth((prev) => {
        if (prev === newWidth) {
          return prev;
        }
        return newWidth;
      });
    };

    updateBookWidth();

    const layoutResizeObserver = new ResizeObserver(updateBookWidth);
    if (storyLayoutRef.current) {
      layoutResizeObserver.observe(storyLayoutRef.current);
    }
    if (sidePanelRef.current) {
      layoutResizeObserver.observe(sidePanelRef.current);
    }
    window.addEventListener('resize', updateBookWidth);

    return () => {
      layoutResizeObserver.disconnect();
      window.removeEventListener('resize', updateBookWidth);
    };
  }, []);

  return (
    <div className="mx-auto w-full py-6 xl:py-8">
      <div className="flex flex-col gap-6 px-4 xl:gap-12 xl:px-0 xxl:mx-auto xxl:w-fit">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            iconLeft={<ArrowLeft />}
            className="w-fit text-black"
            onClick={handleBack}
          />
          <div
            ref={storyLayoutRef}
            className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-8 xxl:justify-center xxl:gap-6"
          >
            <StoryContent
              abstract={initialData?.abstract || ''}
              bookWidth={bookWidth}
              storyId={storyId}
            />
            <div ref={sidePanelRef}>
              <StorySidePanel data={initialData as any} />
            </div>
          </div>
        </div>

        <IndexStoryListSectionLayout
          title={t('similar_stories')}
          stories={storiesProps}
          onSeeAllClick={handleSeeAllClick}
        />
      </div>
    </div>
  );
}
