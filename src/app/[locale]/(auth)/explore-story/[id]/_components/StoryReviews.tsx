'use client';

import { CaretDown, DotsThreeVertical, Trash } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { isEmpty } from 'lodash';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import * as React from 'react';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import Loader from '@/components/core/loader/Loader';
import { mergeClassnames } from '@/components/core/private/utils';
import { useInfiniteScroll } from '@/libs/hooks/useInfiniteScroll';
import { useDeleteStoryReviewMutation, useGetStoryReviewsByStoryIdQuery } from '@/libs/services/modules/story-reviews';
import { SHOW_LIMIT_REVIEWS } from '@/libs/services/modules/story-reviews/getStoryReviewsByStoryId';
import type { StoryReview as TStoryReview } from '@/libs/services/modules/story-reviews/storyReviewsType';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';

type ReviewItemProps = TStoryReview & {
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
};

export const ReviewItem = ({ onDelete, isDeleting, ...storyReview }: ReviewItemProps) => {
  const t = useTranslations('Common');
  const [showMenu, setShowMenu] = useState(false);
  if (isEmpty(storyReview.comment.trim())) {
    return;
  }
  return (
    <div className="flex flex-col gap-4 rounded-[20px] p-4 shadow-[inset_0_-0.5px_0_0_#E3E5EB]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar imageUrl={storyReview.user?.photo?.path} name={storyReview.user?.fullName} />
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-5">
              {storyReview.user?.fullName}
            </p>
            {storyReview?.createdAt && (
              <p className="text-xs leading-[14px] text-[#00000080]">
                {new Date(storyReview.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}

          </div>
        </div>
        <div className="relative">
          <IconButton variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)}>
            <DotsThreeVertical />
          </IconButton>
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 w-32 rounded-lg border border-neutral-90 bg-white py-1 shadow-md">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-50"
                onClick={() => {
                  onDelete?.(storyReview.id);
                  setShowMenu(false);
                }}
                disabled={isDeleting}
              >
                <Trash size={14} />
                {t('delete')}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 text-opacity-80">
        <p className="text-sm leading-[22px]">{storyReview.comment.trim()}</p>
      </div>
    </div>
  );
};

export default function StoryReviews() {
  const { id } = useParams();
  const t = useTranslations('Common');
  const tExploreStory = useTranslations('ExploreStory');

  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<TStoryReview[]>([]);

  const { data: storyReviews, isLoading, isFetching } = useGetStoryReviewsByStoryIdQuery({
    storyId: id,
    page: currentPage,
    limit: SHOW_LIMIT_REVIEWS,
  });

  const [deleteStoryReview, { isLoading: isDeleting }] = useDeleteStoryReviewMutation();

  const requireAuth = useCallback(() => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  }, [session, router, pathname]);

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

  const handleDelete = async (reviewId: number) => {
    if (!requireAuth()) {
      return;
    }
    try {
      await deleteStoryReview(reviewId).unwrap();
      setItems(prev => prev.filter(item => item.id !== reviewId));
      pushSuccess(t('delete_success'));
    } catch {
      pushError(t('delete_error'));
    }
  };

  if (isLoading) {
    return null;
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/assets/icons/review-card.svg"
          alt="No reviews illustration"
          width={66}
          height={64}
        />
        {tExploreStory('no_reviews')}
      </div>
    );
  }

  return (
    <>
      <div
        className={mergeClassnames('flex flex-1 flex-col gap-4')}
      >
        {items.map((review, index) => (
          <div key={review.id}>
            <ReviewItem
              {...review}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
            {index < items.length - 1 && (
              <div ref={loadMoreRef} className="hidden h-px lg:block" />
            )}
          </div>
        ))}
      </div>

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
    </>
  );
};
