'use client';

import { Star } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { StoriesSkeleton } from '@/components/loadingState/Skeletons';

type MyFeedbackPanelProps = {
  huberId?: number;
};

export default function MyFeedbackPanel({ huberId: _huberId }: MyFeedbackPanelProps) {
  const tCommon = useTranslations('Common');

  // TODO: replace with real feedback query when BE ready
  // const { data, isLoading } = useGetHuberFeedbackQuery({ id: huberId }, { skip: !huberId });
  const isLoading = false;
  const feedbackList: any[] = [];

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  if (!feedbackList || feedbackList.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-90 bg-white p-6 text-center shadow-sm">
        <div className="bg-primary-95 flex size-14 items-center justify-center rounded-full text-primary-50">
          <Star size={28} weight="fill" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-neutral-10">{tCommon('feedback_empty_title')}</p>
          <p className="max-w-sm text-sm leading-5 text-neutral-40">{tCommon('feedback_empty_description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {feedbackList.map((item: any) => (
        <div key={item.id} className="rounded-xl border border-neutral-90 bg-white p-4 shadow-sm">
          <p className="text-sm text-neutral-10">{item.content}</p>
        </div>
      ))}
    </div>
  );
}
