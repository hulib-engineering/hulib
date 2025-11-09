'use client';

import {
  CalendarDot,
} from '@phosphor-icons/react';
import { useLocale } from 'next-intl';
import * as React from 'react';

import { mergeClassnames } from '@/components/core/private/utils';
import Label from '@/components/Label';
import type { User } from '@/features/users/types';
import { useGetModerationHistoryQuery } from '@/libs/services/modules/moderation';
import type { ModerationHistory } from '@/libs/services/modules/moderation/type';
import { toLocaleDateString } from '@/utils/dateUtils';

const ModerationCard = ({ createdAt, report, manualReason, actionType }: ModerationHistory) => {
  const locale = useLocale();

  return (
    <div className={mergeClassnames('relative size-full rounded-2xl bg-neutral-98 px-5 py-4', actionType === 'ban' && 'bg-red-98')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5 font-medium leading-tight text-neutral-20">
          <CalendarDot className="text-[#343330]" />
          <span>{toLocaleDateString(new Date(createdAt).toLocaleDateString(), locale)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-base font-medium">Reason:</Label>
          <div
            className="rounded-2xl border border-neutral-90 bg-neutral-98 px-3 py-3.5 text-sm leading-4 text-neutral-40"
          >
            {report ? `${report?.reason}\n${report?.customReason}` : manualReason}
          </div>
        </div>
      </div>
      <span
        className={mergeClassnames(
          'absolute right-5 top-4 rounded-full bg-green-50 px-4 py-2 text-sm font-medium leading-4 text-white',
          actionType === 'ban' && 'bg-red-50',
          actionType === 'warn' && 'bg-orange-50',
        )}
      >
        {actionType === 'ban' ? 'BANNED' : actionType === 'unban' ? 'Un-ban' : actionType === 'warn' ? 'Warning' : 'Un-warn'}
      </span>
    </div>
  );
};

const UserModerationList = ({ data }: { data: User }) => {
  const { data: moderationHistory, isLoading } = useGetModerationHistoryQuery({ userId: data?.id }, { skip: !data?.id });

  if (isLoading) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden bg-white xl:rounded-xl xl:shadow-sm">
      <div className="flex flex-1 flex-col gap-6 border-r bg-white px-8 py-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          {moderationHistory?.map((item: ModerationHistory) => (
            <ModerationCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserModerationList;
