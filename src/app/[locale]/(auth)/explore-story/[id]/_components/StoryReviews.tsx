'use client';

import { CaretDown, DotsThreeVertical } from '@phosphor-icons/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { isEmpty } from 'lodash';
import { useTranslations } from 'next-intl';
import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import Loader from '@/components/core/loader/Loader';
import { mergeClassnames } from '@/components/core/private/utils';
import { useInfiniteScroll } from '@/libs/hooks/useInfiniteScroll';
import { useGetStoryReviewsByStoryIdQuery } from '@/libs/services/modules/story-reviews';
import { SHOW_LIMIT_REVIEWS } from '@/libs/services/modules/story-reviews/getStoryReviewsByStoryId';
import type { StoryReview as TStoryReview } from '@/libs/services/modules/story-reviews/storyReviewsType';

export const ReviewItem = (params: TStoryReview) => (
  <div className="flex flex-col gap-4 rounded-[20px] p-4 shadow-[inset_0_-0.5px_0_0_#E3E5EB]">
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar imageUrl={params.user?.photo?.path} name={params.user?.fullName} />
        <div className="flex flex-col">
          <p className="text-sm font-medium leading-5">
            {params.user?.fullName}
          </p>
          {params?.createdAt && (
            <p className="text-xs leading-[14px] text-[#00000080]">
              {new Date(params.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}

        </div>
      </div>
      <IconButton variant="ghost" size="sm">
        <DotsThreeVertical />
      </IconButton>
    </div>
    <div className="flex flex-col gap-1 text-opacity-80">
      <p className="text-sm leading-[22px]">{isEmpty(params.comment.trim()) ? 'No comment' : params.comment.trim()}</p>
    </div>
  </div>
);

export default function StoryReviews({ maxHeight }: { maxHeight?: number }) {
  const { id } = useParams();
  const t = useTranslations('Common');

  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<TStoryReview[]>([]);

  const { data: storyReviews, isLoading, isFetching } = useGetStoryReviewsByStoryIdQuery({
    storyId: id,
    page: currentPage,
    limit: SHOW_LIMIT_REVIEWS,
  });
  console.log('storyReviews', storyReviews);
  const hasNextPage
    = storyReviews?.meta?.currentPage && storyReviews?.meta?.totalPages
      ? storyReviews.meta.currentPage < storyReviews.meta.totalPages
      : false;

  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetching) {
      setCurrentPage(prevState => prevState + 1);
    }
  }, hasNextPage && !isFetching);

  useEffect(() => {
    if (storyReviews?.data) {
      if (currentPage === 1) {
        setItems(storyReviews.data); // reset when filter changes
      } else {
        setItems((prev) => {
          return Array.from(new Map([...prev, ...storyReviews.data].map(i => [i.id, i])).values());
        });
      }
    }
  }, [storyReviews, currentPage]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div
      className={mergeClassnames(
        'flex w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm',
      )}
      style={{ height: maxHeight && maxHeight > 0 ? maxHeight : 'auto' }}
    >
      <h6 className="shrink-0 text-xl font-medium text-neutral-20 lg:font-bold">
        {t('reader_views', { view: storyReviews?.meta.totalItems ?? 0 })}
      </h6>
      {items?.length === 0
        ? (
            <Image
              src="/assets/images/landing/no-results-found.png"
              className="h-full w-auto object-contain"
              style={{ maxHeight: maxHeight && maxHeight > 0 ? maxHeight - 92 : 'auto' }}
              width={300}
              height={300}
              quality={100}
              alt="No results found"
            />
          )
        : (
            <div
              className={mergeClassnames('flex flex-1 flex-col gap-4', maxHeight && maxHeight > 0 && 'overflow-y-auto')}
            >
              {items.map(review => <ReviewItem key={review.id} {...review} />)}
            </div>
          )}

      {/* Infinite scroll anchor */}
      <div ref={loadMoreRef} className="hidden h-px lg:block" />

      {hasNextPage && (
        <div className="flex items-center justify-center">
          {hasNextPage && (!isFetching ? (
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={handleLoadMore}>
              <div className="flex items-center gap-1.5">
                <CaretDown />
                <span>{t('see_more')}</span>
              </div>
            </Button>
          ) : <Loader />)}
        </div>
      )}
    </div>
  );
};
