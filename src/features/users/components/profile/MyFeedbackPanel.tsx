'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { HeartIcon } from '@phosphor-icons/react';
import { StoriesSkeleton } from '@/components/loadingState/Skeletons';

type MyFeedbackPanelProps = {
  huberId?: number;
};

// ========================V MOCK UP DATA V==============================
// TODO: remove MOCK UP DATA once integrated FE to BE
type HuberFeedback = {
  id: number;
  userName: string;
  userAvatar: string; // URL
  rating: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  content: string;
};
// Note: uncomment the below for mock up data
const MOCK_HUBER_FEEDBACK: HuberFeedback[] = [
  /* {
    id: 1,
    userName: 'Emily Carter',
    userAvatar: '',
    rating: 5,
    createdAt: '2024-07-24T09:15:00Z',
    content: 'Super responsive and professional. Everything was delivered ahead of schedule.',
  },
  {
    id: 2,
    userName: 'Daniel Nguyen',
    userAvatar: '',
    rating: 4,
    createdAt: '2024-06-18T14:40:00Z',
    content: 'Great communication and solid results. Would work together again.',
  },
  {
    id: 3,
    userName: 'Sophia Martinez',
    userAvatar: '',
    rating: 5,
    createdAt: '2024-05-02T03:05:00Z',
    content: 'Exceeded my expectations. Very attentive to detail and easy to work with.',
  },
  {
    id: 4,
    userName: 'Liam Johnson',
    userAvatar: '',
    rating: 3,
    createdAt: '2024-03-11T18:22:00Z',
    content: 'Good overall, but there were a few delays along the way.',
  }, */
];

// Mimics RTK Query's { data, isLoading } shape — swap for the real hook later
const useMockHuberFeedbackQuery = (
  _args: { id?: number },
  options?: { skip?: boolean },
) => ({
  data: options?.skip ? undefined : MOCK_HUBER_FEEDBACK,
  isLoading: false,
});
// =====================^ MOCK UP DATA ^=================================

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

  // TODO: replace with real feedback query when BE ready
  // const { data: feedbackList, isLoading } = useGetHuberFeedbackQuery({ id: huberId }, { skip: !huberId });
  const { data: feedbackList, isLoading } = useMockHuberFeedbackQuery({ id: huberId }, { skip: !huberId }); // Note: this one is mockup query, replace when ready

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
    <div className="flex flex-col gap-6 px-5">
      {feedbackList.map((item: any) => (
        <div key={item.id} className="border-b">
          <div className="flex flex-row gap-2">
            <Image className="rounded-4xl" alt="icon" height={44} width={44} src={item.userAvatar} />
            <div>
              <span className="text-xl font-medium">{item.userName}</span>
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
