'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HeartIcon } from '@phosphor-icons/react';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';
import type { UserFeedbackItem } from '@/libs/services/modules/user/getUserFeedback';
import { useGetUserFeedbackQuery } from '@/libs/services/modules/user';

type MyFeedbackPanelProps = {
  huberId?: number;
};

const PAGE_SIZE = 10;

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
      {feedbackList.map(item => (
        <div key={item.id} className="border-b">
          <div className="flex flex-row gap-2">
            <Image className="rounded-4xl" alt="icon" height={44} width={44} src={item.feedbackBy.photo ?? ''} />
            <div>
              <span className="text-xl font-medium">{item.feedbackBy.fullName}</span>
              <div className="flex flex-row gap-3">
                <Rating userRating={item.rating} />
                <div className="text-sm text-[#00000080]">{item.createdAt}</div>
              </div>
            </div>
          </div>
          <p className="pb-5 pt-2 text-sm">{item.content}</p>
        </div>
      ))}
    </div>
  );
}
