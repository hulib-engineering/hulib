import { CaretDown, Heart } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import Avatar from '@/components/core/avatar/Avatar';
import IllustrationIcon from '@/components/core/icons/illustration';
import { mergeClassnames } from '@/components/core/private/utils';
import Loader from '@/components/core/loader/Loader';
import { useGetUserFeedbackQuery } from '@/libs/services/modules/user';
import type { UserFeedbackItem } from '@/libs/services/modules/user/getUserFeedback';
import { FEEDBACK_PAGE_LIMIT } from '@/libs/services/modules/user/getUserFeedback';

function FeedbackCardSkeleton() {
  return (
    <div className="relative overflow-hidden py-6 after:absolute after:inset-0 after:animate-gradient-animation after:bg-[linear-gradient(110deg,_transparent_0%,_transparent_35%,_#ffffff60_50%,_transparent_65%,_transparent_100%)]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="size-12 shrink-0 rounded-full bg-neutral-90" />
          <div className="flex flex-col gap-1.5">
            <div className="h-5 w-32 rounded bg-neutral-90" />
            <div className="h-3.5 w-24 rounded bg-neutral-90" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="h-3.5 w-full rounded bg-neutral-90" />
          <div className="h-3.5 w-10/12 rounded bg-neutral-90" />
        </div>
      </div>
    </div>
  );
}

function RatingHearts({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Heart
          key={n}
          weight="fill"
          size={14}
          className={n <= rating ? 'text-pink-50' : 'text-neutral-90'}
        />
      ))}
    </div>
  );
}

function FeedbackCard({ content, rating, createdAt, feedbackBy }: UserFeedbackItem) {
  const locale = useLocale();
  const dateFormatted = createdAt
    ? new Date(createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar imageUrl={feedbackBy.photo} name={feedbackBy.fullName} size="lg" />
        <div className="flex flex-col">
          <p className="text-xl font-medium text-neutral-20">{feedbackBy.fullName}</p>
          <div className="flex items-center gap-3">
            <RatingHearts rating={rating} />
            {dateFormatted && (
              <p className="text-xs text-neutral-40">{dateFormatted}</p>
            )}
          </div>
        </div>
      </div>
      {content && (
        <p className="text-sm leading-[22px] text-neutral-20 opacity-80">{content}</p>
      )}
    </div>
  );
}

type HuberFeedbackPanelProps = {
  userId: number;
};

export default function MyFeedbackPanel({ userId }: HuberFeedbackPanelProps) {
  const t = useTranslations('MyProfile');
  const tCommon = useTranslations('Common');

  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<UserFeedbackItem[]>([]);

  const { data, isLoading, isFetching } = useGetUserFeedbackQuery(
    { userId, page: currentPage, limit: FEEDBACK_PAGE_LIMIT },
    { skip: !userId },
  );

  const hasNextPage = data?.meta
    ? data.meta.currentPage < data.meta.totalPages
    : false;

  useEffect(() => {
    if (!data?.data) {
      return;
    }
    if (currentPage === 1) {
      setItems(data.data);
    } else {
      setItems(prev =>
        Array.from(new Map([...prev, ...data.data].map(i => [i.id, i])).values()),
      );
    }
  }, [data, currentPage]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col divide-y divide-neutral-90 px-5">
        {Array.from({ length: 5 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <FeedbackCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 px-8 py-5">
        <IllustrationIcon />
        <p className="text-center text-xl font-medium text-primary-50">
          {t('feedback_panel.no_feedback_title')}
        </p>
      </div>
    );
  }

  return (
    <div className={mergeClassnames('flex flex-col gap-4')}>
      <div className="flex flex-col divide-y divide-neutral-90 px-5">
        {items.map(item => (
          <div key={item.id} className="py-6">
            <FeedbackCard {...item} />
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex items-center justify-center py-2">
          {!isFetching
            ? (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-neutral-variant-80 bg-white px-4 py-3 text-base font-medium text-primary-50"
                  onClick={handleLoadMore}
                >
                  <CaretDown size={20} />
                  {tCommon('see_more')}
                </button>
              )
            : <Loader />}
        </div>
      )}
    </div>
  );
}
