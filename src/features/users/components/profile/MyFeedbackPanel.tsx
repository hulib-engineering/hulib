'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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
      <div className="flex min-h-[320px] flex-col items-center gap-4 rounded-2xl text-center">
        <Image src="/assets/icons/profile/feedback/heart.svg" alt="heart" height={120} width={116} />
        <p className="text-lg font-medium text-primary-50">{tCommon('feedback_empty')}</p>
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
