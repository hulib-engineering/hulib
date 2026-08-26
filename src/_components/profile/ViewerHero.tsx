'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { DotsThreeIcon, PaperPlaneTiltIcon, WarningIcon } from '@phosphor-icons/react';
import JoinedSince from './JoinedSince';
import RoleBadge from './RoleBadge';
import UserAvatar from './UserAvatar';
import { Role } from '@/types/common';
import type { TUserDetail } from '@/features/users/types';
import Button from '@/components/core/button/Button';

type ViewerHeroProps = {
  userDetail: TUserDetail;
  onChatClick?: () => void;
  onReportClick?: () => void;
};

export default function ViewerHero({ userDetail, onChatClick, onReportClick }: ViewerHeroProps) {
  const t = useTranslations('MyProfile');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const role = userDetail?.role?.id === Role.HUBER ? 'huber' : 'liber';
  const joinDate = role === 'huber' ? (userDetail?.huberSince ?? userDetail?.createdAt) : userDetail?.createdAt;

  const handleReport = () => {
    setDropdownOpen(false);
    onReportClick?.();
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-4 py-6 shadow-sm md:flex-row">
      <div className="flex flex-1 items-center gap-6">
        <UserAvatar
          photo={userDetail.photo}
          fallbackSeed={userDetail?.fullName ?? String(userDetail?.id ?? 'user')}
          className="size-16 shrink-0 lg:size-40"
        />

        <div className="flex flex-1 flex-col gap-6 lg:pt-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <RoleBadge role={role} />
                <h4 className="text-xl font-medium leading-tight text-black lg:text-[28px] lg:leading-9">
                  {userDetail?.fullName}
                </h4>
              </div>
              <JoinedSince date={joinDate} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-end justify-end gap-8 self-stretch md:flex-col md:justify-start lg:pt-8">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full bg-neutral-90 transition-colors hover:bg-neutral-80"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <DotsThreeIcon size={20} weight="bold" className="text-neutral-20" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-10 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-neutral-90 bg-white shadow-md">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-10 transition-colors hover:bg-neutral-98"
                onClick={handleReport}
              >
                <WarningIcon size={20} className="text-orange-50" />
                {t('report')}
              </button>
            </div>
          )}
        </div>

        <Button
          className="rounded-full"
          iconLeft={<PaperPlaneTiltIcon size={20} />}
          onClick={onChatClick}
        >
          {t('chat')}
        </Button>
      </div>
    </div>
  );
}
