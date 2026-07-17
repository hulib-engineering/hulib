'use client';

import { Heart, PencilSimple, TelegramLogo } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import NiceAvatar, { genConfig } from 'react-nice-avatar';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { Chip } from '@/components/core/chip/Chip';
import IconButton from '@/components/core/iconButton/IconButton';

type ProfileHeroProps = {
  userDetail: any;
  notMe: boolean;
  isHuberProfile: boolean;
  onEditAvatarClick?: () => void;
  onReportClick?: () => void;
  onChatClick?: () => void;
};

export default function ProfileHero({
  userDetail,
  notMe,
  isHuberProfile,
  onEditAvatarClick,
  onReportClick,
  onChatClick,
}: ProfileHeroProps) {
  const t = useTranslations('MyProfile');

  return (
    <div className="flex flex-col overflow-hidden rounded-xl shadow-sm">
      <div className="border-b border-neutral-90 bg-white p-3 lg:p-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
            <div className="flex flex-row items-center">
              <div className="group lg:min-h-[200px] lg:w-40">
                {userDetail.photo?.path
                  ? (
                      <Avatar
                        imageUrl={userDetail.photo.path}
                        className="size-16 lg:size-40"
                      />
                    )
                  : (
                      <NiceAvatar
                        className="size-16 rounded-full lg:size-40"
                        {...genConfig(userDetail?.fullName ?? String(userDetail?.id ?? 'huber'))}
                      />
                    )}
                {!notMe && (
                  <IconButton
                    variant="soft"
                    size="sm"
                    className="absolute bottom-0 right-0 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                    onClick={onEditAvatarClick}
                  >
                    <PencilSimple weight="bold" />
                  </IconButton>
                )}
              </div>

              <div className="ml-3 flex flex-col gap-1 lg:ml-[40px] lg:gap-4 lg:py-6">
                <div className="flex items-center gap-1 lg:gap-4">
                  <Chip
                    disabled
                    className="h-full w-fit rounded-[8px] border border-[#F9DA6C] bg-[#FDF3CE] px-2 py-1 text-xs font-medium uppercase leading-[14px] text-[#FF7301] opacity-100 lg:px-3 lg:text-xl"
                  >
                    {userDetail?.role?.name}
                  </Chip>
                  <h4 className="text-xl font-medium leading-tight text-black lg:text-[28px] lg:leading-9">
                    {userDetail?.fullName}
                  </h4>
                </div>
                <p className="text-sm text-neutral-40">Tham gia Hulib 18 tháng 6 năm 2026</p>
                {isHuberProfile && (
                  <div className="flex items-center gap-2">
                    <Heart className="text-pink-50" weight="fill" />
                    <p className="text-sm text-black opacity-80">
                      {userDetail?.rating ?? 0}
                      /5 (
                      {t('hearts')}
                      )
                    </p>
                  </div>
                )}
              </div>
            </div>

            {notMe && isHuberProfile && (
              <div className="flex gap-2 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-[114px]"
                  onClick={onReportClick}
                >
                  {t('report')}
                </Button>
                <Button
                  size="sm"
                  iconRight={<TelegramLogo />}
                  className="w-[114px]"
                  onClick={onChatClick}
                >
                  {t('chat')}
                </Button>
              </div>
            )}
          </div>

          {notMe && isHuberProfile && (
            <div className="hidden gap-2 lg:flex">
              <Button variant="outline" size="lg" onClick={onReportClick}>
                {t('report')}
              </Button>
              <Button size="lg" iconRight={<TelegramLogo />} onClick={onChatClick}>
                {t('chat')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
