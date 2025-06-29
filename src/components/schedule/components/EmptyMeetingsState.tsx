import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/button/Button';

const MeetingStoryComponent = ({ isHuber = false }) => {
  const router = useRouter();
  const t = useTranslations('Schedule');

  if (isHuber) {
    return (
      <div className="rounded-[12px] bg-white p-6 shadow-md">
        <p className="mb-6 text-sm leading-relaxed text-neutral-1">
          {t('no_meetings.huber_description')}
        </p>
        <div className="space-y-3 text-base">
          <Button
            className="w-full px-[16px] py-[12px]"
            onClick={() => router.push('/profile')}
          >
            {t('no_meetings.share_story_btn')}
          </Button>
          <button
            type="button"
            className="h-11 w-full rounded-[100px] border border-neutral-variant-80 bg-white px-[16px] py-[12px] text-primary-50"
            onClick={() => router.push('/explore-story')}
          >
            {t('no_meetings.explore_story_btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] bg-white p-6 shadow-md">
      <p className="mb-6 text-sm leading-relaxed text-neutral-1">
        {t('no_meetings.user_description')}
      </p>
      <Button
        className="w-full px-[16px] py-[12px] text-base"
        onClick={() => router.push('/explore-story')}
      >
        {t('no_meetings.explore_story_btn')}
      </Button>
    </div>
  );
};

export default MeetingStoryComponent;
