'use client';

import {
  // BookOpen,
  CalendarDots,
  FacebookLogo,
  InstagramLogo,
  MessengerLogoIcon,
  StarFour,
  ThreadsLogo,
  Trash,
  X,
} from '@phosphor-icons/react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import * as React from 'react';

import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import Modal from '@/components/Modal';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { copyToClipboard } from '@/app/[locale]/(unauth)/(landingpage)/_components/home/utils';
import { AppConfig } from '@/utils/AppConfig';
import ShareModal from '@/app/[locale]/(auth)/explore-story/[id]/_components/ShareModal';
import { setPostLoginRedirect } from '@/utils/authRedirect';
import AuthorBasicInfo from '@/components/author/AuthorBasicInfo';
import { useGetHuberBookedSessionsQuery } from '@/libs/services/modules/huber';
import { useDeleteStoryMutation, useGetStoriesQuery, useLikeStoryMutation, useShareStoryMutation } from '@/libs/services/modules/stories';
import { ChangeCountEnum } from '@/libs/services/modules/stories/updateLikeCountStory';
import { useGetTimeslotsByHuberQuery } from '@/libs/services/modules/time-slots';
import BookInfo from '@/features/stories/components/BookInfo';
import { StoryCard } from '@/features/stories/components/StoryCard';
import StoryForm from '@/features/stories/components/StoryForm';
import PersonalCalendarModal from '@/features/stories/components/PersonalCalendarModal';
import type { Story } from '@/libs/services/modules/stories/storiesType';
import { openChat } from '@/libs/store/messenger';

type StorySidePanelProps = {
  data: Story;
  isFavorite?: boolean;
  isPastStoryContent?: boolean;
  floatingBooking: boolean;
};

type BookMeetingProps = {
  handleBookingClick: () => void;
  userId: number | undefined;
  floatingBooking: boolean;
};

function BookMeeting({ handleBookingClick, userId, floatingBooking }: BookMeetingProps) {
  const t = useTranslations('ExploreStory');
  const { status } = useSession();

  const disabledCondition = status === 'unauthenticated' || userId === undefined;
  const { data: bookedSessionsList, isLoading } = useGetHuberBookedSessionsQuery({ id: userId }, { skip: !userId });

  const max_lg = floatingBooking ? 'max-lg:absolute max-[425px]:bottom-10 max-lg:bottom-20 max-lg:left-0 z-[5] max-lg:mx-4' : '';
  const lg = 'lg:p-5';

  return (
    <div
      id="booking-component"
      className={mergeClassnames(
        'w-auto flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-white shadow-sm border-2 border-primary-70 p-4',
        max_lg,
        lg,
      )}
    >
      <p className="text-center text-base leading-6 text-neutral-20">{disabledCondition ? t('booking_cta_unauth') : t('booking_cta')}</p>
      <Button
        onClick={handleBookingClick}
        disabled={disabledCondition}
        iconLeft={<CalendarDots className={mergeClassnames(!disabledCondition && 'text-white')} size={20} weight="bold" />}
        className={mergeClassnames('w-full', !disabledCondition && 'border border-primary-80 bg-gradient-to-b from-blue-40 to-lavender-40 text-white hover:opacity-95')}
      >
        <span className="mt-1">{t('book_a_meeting')}</span>
      </Button>
      {disabledCondition ? <></>
        : (
            <p className="text-center text-xs leading-[14px] text-neutral-20">
              {t('booking_count', { bookingCount: `${(disabledCondition || isLoading) ? 0 : bookedSessionsList?.length}` })}
            </p>
          )}
    </div>
  );
}

export default function StorySidePanel({ data, floatingBooking }: StorySidePanelProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ExploreStory');
  const tCommon = useTranslations('Common');
  const tHuber = useTranslations('Huber');

  const [shareStory] = useShareStoryMutation();
  const [handleUpdateLikeCount] = useLikeStoryMutation();
  const [deleteStory, { isLoading: isDeletingStory }] = useDeleteStoryMutation();

  // TODO: remove if storyDetailQuery API returns a number of published stories in humanbook
  const { data: storiesList } = useGetStoriesQuery(
    { humanBookId: data?.humanBook?.id, publishStatus: 'published', type: 'most-popular' },
    { skip: !data?.humanBook?.id },
  );

  const requireAuth = React.useCallback(() => {
    if (!session) {
      setPostLoginRedirect(pathname);
      router.push('/auth/login');
      return false;
    }
    return true;
  }, [session, router, pathname]);

  const [isLiked, setIsLiked] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(data?.likeCount ?? 0);
  const [shareCount, setShareCount] = React.useState(data?.shareCount ?? 0);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = React.useState(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = React.useState(false);
  const [isPersonalCalendarModalOpen, setIsPersonalCalendarModalOpen] = React.useState(false);

  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const isOwner = !!userId && !!data?.humanBook?.id && Number(userId) === Number(data.humanBook.id);

  const { data: timeslotsData } = useGetTimeslotsByHuberQuery(
    { id: data?.humanBook?.id as number },
    { skip: !isOwner || !data?.humanBook?.id },
  );
  const hasTimeslots = React.useMemo(() => {
    const raw = timeslotsData as unknown;
    if (Array.isArray(raw)) {
      return raw.length > 0;
    }
    if (raw && typeof raw === 'object' && 'data' in (raw as any)) {
      const arr = (raw as any).data;
      return Array.isArray(arr) && arr.length > 0;
    }
    return false;
  }, [timeslotsData]);

  const prevLikeCountRef = React.useRef(data?.likeCount);

  const dispatch = useAppDispatch();
  const handleOpenHuberChat = () => {
    if (!requireAuth()) {
      return;
    }
    if (!data?.humanBook?.id) {
      return;
    }

    dispatch(
      openChat({
        id: data.humanBook.id.toString(),
        name: data.humanBook.fullName,
        avatarUrl: data.humanBook.photo?.path,
        isOpen: true,
        isMinimized: false,
        unread: 0,
      }),
    );
  };

  React.useEffect(() => {
    if (prevLikeCountRef.current !== data?.likeCount) {
      prevLikeCountRef.current = data?.likeCount;
      setLikeCount(data?.likeCount ?? 0);
    }
  }, [data?.likeCount]);

  React.useEffect(() => {
    if (userId && data?.likedUserIds) {
      setIsLiked(
        data.likedUserIds.some((id: string) => Number(id) === Number(userId)),
      );
    }

    if (userId && data?.sharedUserIds) {
      setIsShared(
        data.sharedUserIds.some((id: string) => Number(id) === Number(userId)),
      );
    }
  }, [data?.likedUserIds, data?.sharedUserIds, userId]);

  const storyUrl = React.useMemo(() => {
    if (!data?.id) {
      return '';
    }
    const localePrefix = locale === AppConfig.defaultLocale ? '' : `/${locale}`;
    return new URL(
      `${localePrefix}/explore-story/${data.id}`,
      'https://hulib.org',
    ).toString();
  }, [data?.id, locale]);

  const shareOptions = React.useMemo(() => [
    {
      icon: FacebookLogo,
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}`,
    },
    { icon: InstagramLogo, label: 'Instagram', url: 'https://www.instagram.com/' },
    { icon: ThreadsLogo, label: 'Threads', url: 'https://www.threads.net/' },
  ], [storyUrl]);

  const clickLikeStory = React.useCallback(async () => {
    if (!requireAuth()) {
      return;
    }
    try {
      const isCurrentlyLiked = isLiked;
      if (isCurrentlyLiked) {
        const res = await handleUpdateLikeCount({
          id: data.id,
          type: ChangeCountEnum.DOWN,
          userId,
        }).unwrap();
        setIsLiked(false);
        setLikeCount(res.likeCount);
        pushSuccess(t('story_removed_from_favorites'));
      } else {
        const res = await handleUpdateLikeCount({
          id: data.id,
          type: ChangeCountEnum.UP,
          userId,
        }).unwrap();
        setIsLiked(true);
        setLikeCount(res.likeCount);
        pushSuccess(t('story_added_to_favorites'));
      }
    } catch {
      pushError(t('like_error'));
    }
  }, [requireAuth, isLiked, handleUpdateLikeCount, data.id, userId, t]);

  const handleClickShare = React.useCallback(async () => {
    if (!requireAuth()) {
      return;
    }
    if (!storyUrl) {
      return;
    }

    if (!isShared) {
      const isCopied = await copyToClipboard(storyUrl);
      const rs = await shareStory({ storyId: data.id, userId }).unwrap();
      setIsShared(true);

      if (!isCopied) {
        pushError(t('copy_link_error'));
        return;
      }

      setShareCount(rs.shareCount);
    }
    pushSuccess(t('copy_link_success'));
    setIsShareModalOpen(true);
  }, [t, requireAuth, storyUrl, isShared, shareStory, data.id, userId]);

  const handleCloseShareModal = React.useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleAuthorClick = React.useCallback(() => {
    if (!requireAuth()) {
      return;
    }
    if (!data?.humanBook?.id) {
      return;
    }
    router.push(`/users/${data.humanBook.id}`);
  }, [requireAuth, router, data?.humanBook?.id]);

  const handleBookingClick = React.useCallback(() => {
    if (!requireAuth()) {
      return;
    }
    if (!data?.humanBook?.id) {
      return;
    }
    router.push(`${data?.id}_${data?.humanBook?.id}/booking`);
  }, [requireAuth, router, data?.id, data?.humanBook?.id]);

  const handleDelete = React.useCallback(async () => {
    try {
      await deleteStory(data.id).unwrap();
      setIsDeleteModalOpen(false);
      setIsDeleteSuccessModalOpen(true);
    } catch {
      pushError(t('error_contact_admin'));
    }
  }, [deleteStory, data.id, t]);

  const handleCloseDeleteSuccessModal = React.useCallback(() => {
    setIsDeleteSuccessModalOpen(false);
    if (data?.humanBook?.id) {
      router.push(`/users/${data.humanBook.id}?tab=stories`);
    } else {
      router.push('/');
    }
  }, [router, data?.humanBook?.id]);

  const handleCloseEditSuccessModal = React.useCallback(() => {
    setIsEditSuccessModalOpen(false);
  }, []);

  const handleEditSuccess = React.useCallback(() => {
    setIsEditModalOpen(false);
    setIsEditSuccessModalOpen(true);
  }, []);

  return (
    <>
      <ShareModal
        open={isShareModalOpen}
        onClose={handleCloseShareModal}
        shareOptions={shareOptions}
      />

      <div className="flex w-full flex-col gap-y-5 lg:w-[336px] lg:max-w-[336px] lg:shrink-0">
        <BookInfo
          cover={data?.cover}
          topics={data?.topics}
          viewCount={data?.viewCount}
          likeCount={likeCount}
          shareCount={shareCount}
          isLiked={isLiked}
          isOwner={isOwner}
          handleClickShare={handleClickShare}
          clickLikeStory={clickLikeStory}
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
        />

        {isOwner ? (
          !hasTimeslots && (
            <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-[#faf7fc] p-5 shadow-sm">
              <div className="flex items-start gap-2">
                <StarFour className="shrink-0 text-[#0858fa]" size={20} weight="fill" />
                <p className="text-sm leading-5 text-[#0858fa]">{tCommon('update_schedule_online')}</p>
              </div>
              <Button
                iconLeft={<CalendarDots className="text-white" size={20} weight="bold" />}
                onClick={() => setIsPersonalCalendarModalOpen(true)}
                className="w-full"
              >
                {tCommon('update_personal_schedule')}
              </Button>
            </div>
          )
        ) : (
          <BookMeeting
            handleBookingClick={handleBookingClick}
            userId={data?.humanBook?.id}
            floatingBooking={floatingBooking}
          />
        )}

        <div className="flex w-full flex-col gap-y-3 overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
          <AuthorBasicInfo
            humanBook={data?.humanBook}
            numStories={storiesList?.data?.length}
            onClickFunction={handleAuthorClick}
            onClickHuberChat={handleOpenHuberChat}
          />

          <Button
            variant="outline"
            className="box-border rounded-[100px] border border-[#C2C6CF] p-3 max-lg:hidden"
            onClick={handleOpenHuberChat}
          >
            <MessengerLogoIcon size={20} className="shrink-0" />
            <span className="mt-1">{t('lets_chat')}</span>
          </Button>

          {/* For mobile screen only */}
          {/*! storiesList?.data[0] ? <></>
            : (
                <div className="box-border flex w-full items-center gap-2 rounded-lg
            border border-[#C7C9CB] bg-[#F0F5FF] p-2 lg:hidden"
                >
                  <BookOpen color="#0442BF" size={16} />
                  <span className="flex-1 text-sm leading-4 text-black translate-y-[2px]">
                    {storiesList?.data[0]?.title}
                  </span>
                </div>
              ) */}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} disableClosingTrigger onClose={() => setIsEditModalOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
          <StoryForm
            type="edit"
            story={data as unknown as Story}
            onSucceed={handleEditSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal.Panel>
      </Modal>

      {/* Edit Success Modal */}
      <Modal open={isEditSuccessModalOpen} onClose={handleCloseEditSuccessModal}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl bg-neutral-98 shadow-none">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-end px-4 pt-4">
              <IconButton variant="ghost" size="lg" aria-label={tCommon('cancel') as string} onClick={handleCloseEditSuccessModal}>
                <X className="text-[#343330]" size={20} />
              </IconButton>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 px-6 pb-6">
              <div className="rounded-full bg-[#D9FDEE] p-1">
                <Image
                  alt="Check icon"
                  src="/assets/icons/check-fill-circle.svg"
                  width={48}
                  height={48}
                  className="size-12 object-cover"
                />
              </div>
              <h6 className="text-center text-xl font-bold text-neutral-10">
                {tCommon('edit_book_success')}
              </h6>
              <p className="text-center text-sm leading-5 text-neutral-40">
                {tHuber('thanks_for_story')}
              </p>
              <div className="flex w-full gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    handleCloseEditSuccessModal();
                    if (data?.humanBook?.id) {
                      router.push(`/users/${data.humanBook.id}?tab=stories`);
                    }
                  }}
                >
                  {tHuber('back_to_profile')}
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => {
                    handleCloseEditSuccessModal();
                    router.push('/');
                  }}
                >
                  {tHuber('create_new_book')}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Panel>
      </Modal>

      {/* Delete Confirm Modal - Figma 16331 */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl px-1 py-5 shadow-none lg:px-5">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex w-full justify-end px-4">
              <IconButton variant="ghost" size="lg" aria-label={tCommon('cancel') as string} onClick={() => setIsDeleteModalOpen(false)}>
                <X className="text-[#2e3032]" size={20} />
              </IconButton>
            </div>
            <h4 className="px-4 text-center text-[28px] font-medium leading-9 text-[#ee0038] lg:px-0">
              {t('confirm_delete_book')}
            </h4>
            <StoryCard data={data as unknown as Story} withoutActions />
            <p className="px-4 text-center text-sm leading-5 text-[#171819] lg:px-0">
              {t('story_delete_warning')}
              <br />
              {t('cannot_undo_action')}
            </p>
            <div className="flex w-full px-4 lg:px-0">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                iconLeft={<Trash className="text-primary-50" size={20} weight="bold" />}
                disabled={isDeletingStory}
                animation={isDeletingStory ? 'progress' : undefined}
                onClick={handleDelete}
              >
                {tCommon('delete')}
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>

      {/* Delete Success Modal */}
      <Modal open={isDeleteSuccessModalOpen} onClose={handleCloseDeleteSuccessModal}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl bg-neutral-98 shadow-none">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-end px-4 pt-4">
              <IconButton variant="ghost" size="lg" aria-label={tCommon('cancel') as string} onClick={handleCloseDeleteSuccessModal}>
                <X className="text-[#343330]" size={20} />
              </IconButton>
            </div>
            <div className="flex flex-col items-center justify-center gap-5 px-6 pb-6">
              <div className="rounded-full bg-[#D9FDEE] p-1">
                <Image
                  alt="Check icon"
                  src="/assets/icons/check-fill-circle.svg"
                  width={48}
                  height={48}
                  className="size-12 object-cover"
                />
              </div>
              <h6 className="text-center text-xl font-bold text-neutral-10">
                {t('story')}
                {' "'}
                <span className="text-primary-60">{(data as any)?.title}</span>
                {'" '}
                {t('is_deleted_successfully')}
              </h6>
              <Button size="lg" fullWidth onClick={handleCloseDeleteSuccessModal}>
                {tHuber('back_to_profile')}
              </Button>
            </div>
          </div>
        </Modal.Panel>
      </Modal>

      {/* Personal Calendar Modal */}
      <Modal open={isPersonalCalendarModalOpen} onClose={() => setIsPersonalCalendarModalOpen(false)}>
        <Modal.Backdrop />
        <Modal.Panel className="w-full shadow-none lg:w-5/6 lg:max-w-6xl">
          <PersonalCalendarModal onClose={() => setIsPersonalCalendarModalOpen(false)} />
        </Modal.Panel>
      </Modal>
    </>
  );
}
