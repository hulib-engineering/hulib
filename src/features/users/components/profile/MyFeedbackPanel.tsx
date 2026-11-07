'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { HeartIcon } from '@phosphor-icons/react';
import Avatar from '@/components/core/avatar/Avatar';
import { mergeClassnames } from '@/components/core/private/utils';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import type { UserFeedbackItem } from '@/libs/services/modules/user/getUserFeedback';
import { useGetUserFeedbackQuery } from '@/libs/services/modules/user';

type MyFeedbackPanelProps = {
  huberId?: number;
};

const PAGE_SIZE = 10;

const formatFeedbackDate = (createdAt: string, locale: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

function Rating({ userRating }: { userRating: number }) {
  return (
    <div className="flex flex-row gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <HeartIcon
          key={n}
          size={16}
          weight="fill"
          className={n <= userRating ? 'text-pink-50' : 'text-neutral-70'}
        />
      ))}
    </div>
  );
}

export default function MyFeedbackPanel({ huberId }: MyFeedbackPanelProps) {
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  const { data, isLoading } = useGetUserFeedbackQuery(
    { userId: huberId as number, page: 1, limit: PAGE_SIZE },
    { skip: !huberId },
  );

  const feedbackList: UserFeedbackItem[] = data?.data ?? [];

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  if (feedbackList.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center gap-4 rounded-2xl text-center">
        <Image src="/assets/icons/profile/feedback/heart.svg" alt="heart" height={120} width={116} />
        <p className="text-lg font-medium text-primary-50">{tCommon('feedback_empty')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:px-5">
      {feedbackList.map((item, index) => (
        <div
          key={item.id}
          className={mergeClassnames(
            'flex flex-col gap-4 pb-6',
            index !== feedbackList.length - 1 && 'border-b border-neutral-90',
          )}
        >
          <div className="flex flex-row items-start gap-3">
            <Avatar
              imageUrl={item.feedbackBy.photo}
              name={item.feedbackBy.fullName}
              size="lg"
              className="shrink-0"
            />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="break-words text-xl font-medium text-neutral-20">{item.feedbackBy.fullName}</span>
              <div className="flex flex-row items-center gap-3">
                <Rating userRating={item.rating} />
                <span className="text-sm text-neutral-40">
                  {formatFeedbackDate(item.createdAt, locale)}
                </span>
              </div>
            </div>
          </div>
          <p className="break-words text-sm leading-6 text-neutral-20">{item.content}</p>
        </div>
      ))}
    </div>
  );
}
