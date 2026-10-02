'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InfoIcon } from '@phosphor-icons/react';
import { mergeClassnames } from '@/components/core/private/utils';
import Popover from '@/components/core/popover/Popover';
import { StoryPublishStatus } from '@/libs/services/modules/stories/storiesType';

type StoryBageProps = {
  status: StoryPublishStatus;
  rejectionReason?: string;
  className?: string;
};

export const StoryBage = ({ status, rejectionReason, className }: StoryBageProps) => {
  const t = useTranslations('Common');

  const isRejected = status === StoryPublishStatus.REJECTED;
  const isDraft = status === StoryPublishStatus.DRAFT;

  function getBadgeStyles() {
    if (isRejected) {
      return 'bg-red-50 text-white';
    }
    if (isDraft) {
      return 'bg-neutral-90 text-neutral-40';
    }
    return 'bg-orange-90 text-orange-40';
  };

  function displayingText() {
    if (isRejected) {
      return t('rejected');
    }
    if (isDraft) {
      return t('draft');
    }
    return t('in_review');
  }

  return (
    <div className={mergeClassnames('flex items-center gap-2 z-10', className)}>
      <span
        className={mergeClassnames(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
          getBadgeStyles(),
        )}
      >
        {displayingText()}
      </span>

      {isRejected && (
        <Popover position="bottom-start">
          <Popover.Trigger>
            <InfoIcon size={20} />
          </Popover.Trigger>
          <Popover.Panel className="w-64 border border-red-50 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm  text-primary-10">
                  {t('rejection_reason')}
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto rounded-md border border-neutral-90 bg-neutral-98 p-3">
                <p className="text-sm leading-relaxed text-neutral-20">
                  {rejectionReason || '—'}
                </p>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      )}
    </div>
  );
};
