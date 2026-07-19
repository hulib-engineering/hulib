'use client';

import {
  Bell,
  MessengerLogo,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo } from 'react';

import Popover from '@/components/core/popover/Popover';
import { mergeClassnames } from '@/components/core/private/utils';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import AvatarPopover from '@/layouts/webapp/AvatarPopover';
import MessengerPopover from '@/layouts/webapp/MessengerPopover';
import NotificationPopover from '@/layouts/webapp/NotificationPopover';
import SkeletonHeader from '@/layouts/webapp/SkeletonHeader';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';
import {
  type MessageResponse,
  chatApi,
  useGetConversationContactsQuery,
} from '@/libs/services/modules/chat';
import {
  notificationApi,
  useGetNotificationsQuery,
} from '@/libs/services/modules/notifications';
import { useLazyGetUsersByIdQuery } from '@/libs/services/modules/user';
import type { Message } from '@/libs/store/messenger';
import { openChat } from '@/libs/store/messenger';
import { Role } from '@/types/common';
import { Link, usePathname, useRouter } from '@/libs/i18nNavigation';

export const HeaderIconButtonWithBadge = ({
  children,
  badge,
  open = false,
}: {
  children: ReactNode;
  badge: number;
  open?: boolean;
}) => (
  <div
    className={mergeClassnames(
      'relative w-fit rounded-[100px] p-2 text-[#343330] hover:bg-neutral-90',
      open && 'bg-primary-90 text-primary-50 hover:bg-primary-90',
    )}
  >
    {children}
    {badge > 0 && (
      <div className="absolute right-0 top-1 flex h-4 w-[18px] items-center justify-center rounded-lg border border-white bg-red-50 px-1 py-[0.5px] text-[10px] font-medium leading-3 text-white">
        {badge}
      </div>
    )}
  </div>
);

const Header = () => {
  const t = useTranslations('LandingPage');

  const router = useRouter();
  const currentPathname = usePathname();
  const user = useAppSelector(state => state.auth.userInfo);

  const { data, isLoading, error } = useGetNotificationsQuery({ page: 1, limit: 5 });
  const { data: conversations = [] } = useGetConversationContactsQuery(
    undefined,
    {
      pollingInterval: 10 * 60 * 1000,
    },
  );
  const totalUnread = conversations.reduce(
    (sum: number, conv: MessageResponse) => sum + (conv.unreadCount || 0),
    0,
  );
  const [fetchParticipantInfo] = useLazyGetUsersByIdQuery();

  const dispatch = useAppDispatch();

  const handleNotificationList = (notifications: any) => {
    dispatch(
      notificationApi.util.updateQueryData(
        'getNotifications',
        { page: 1, limit: 5 },
        (draft) => {
          if (!draft) {
            return;
          }

          Object.assign(draft, notifications);
        },
      ),
    );
  };
  const playReceivedMessageSound = () => {
    const audio = new Audio('/assets/media/message-received.mp3');
    audio.play().catch((e) => {
      console.warn('Audio play blocked:', e);
    });
  };
  const handleIncomingMessage = useCallback(
    async (msg: Message) => {
      const participantId = `${user.id}` === `${msg.from}` ? msg.to : msg.from;
      const participant = await fetchParticipantInfo(participantId);

      dispatch(
        openChat({
          id: `${participantId}`,
          name: 'data' in participant ? participant.fullName : '',
          avatarUrl: 'data' in participant ? participant.photo?.path : '',
          isOpen: false,
          isMinimized: false,
          unread: 0,
        }),
      );

      dispatch(
        chatApi.util.invalidateTags([
          { type: 'Messages', id: `LIST-${participantId}` },
          { type: 'Messages', id: 'LIST' },
        ]),
      );

      playReceivedMessageSound(); // 🔊 Play sound on receiving
    },
    [user.id, fetchParticipantInfo, dispatch],
  );

  const chatListeners = useMemo(
    () => ({
      receive: handleIncomingMessage,
    }),
    [handleIncomingMessage],
  );

  useSocket({
    namespace: 'notification',
    listeners: {
      list: handleNotificationList,
    },
  });
  useSocket({
    namespace: 'chat',
    listeners: chatListeners,
  });

  return (
    <>
      {/* Mobile version */}
      <header className="flex w-screen flex-col bg-white px-4 pb-2 pt-4 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:hidden">
        <div className="relative z-[1000] flex items-center justify-between">
          <Link href="/">
            <Logo size="small" />
          </Link>
          {!user || !user?.id
            ? (
                <SkeletonHeader />
              )
            : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/about"
                    className="rounded-lg px-2 py-3 text-base font-medium leading-5 text-neutral-20"
                  >
                    {t('navigation.about_us')}
                  </Link>
                  <button type="button" className="xl:hidden" onClick={() => router.push('/messages')}>
                    <HeaderIconButtonWithBadge badge={totalUnread} open={currentPathname === '/messages'}>
                      <MessengerLogo className="text-[28px]" />
                    </HeaderIconButtonWithBadge>
                  </button>
                  {(!isLoading && !error) && (
                    <button type="button" className="xl:hidden" onClick={() => router.push('/notifications')}>
                      <HeaderIconButtonWithBadge badge={data ? data.unseenCount : 0} open={currentPathname === '/notifications'}>
                        <Bell className="text-[28px]" />
                      </HeaderIconButtonWithBadge>
                    </button>
                  )}
                </div>
              )}
        </div>
      </header>

      {/* PC version */}
      <header className="hidden w-screen items-center justify-between bg-white px-4 py-6 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:flex xl:px-28">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Logo size="small" />
          </Link>
          {user && user?.role?.id !== Role.ADMIN && (
            <div className="flex items-center gap-3">
              <Link href="/explore-story" className="p-3 font-medium leading-5 text-neutral-10">
                {t('navigation.bookshelf')}
              </Link>
              <Link href="/about" className="p-3 font-medium leading-5 text-neutral-10">
                {t('navigation.about_us')}
              </Link>
            </div>
          )}
        </div>
        {!user || !user?.id
          ? (
              <div className="flex gap-3 px-10 ">
                <SkeletonHeader />
              </div>
            )
          : (
              <div className="flex items-center gap-2">
                <Popover position="bottom-start">
                  {({ open, close }) => (
                    <>
                      <Popover.Trigger data-testid="messenger-popover-trigger">
                        <HeaderIconButtonWithBadge badge={totalUnread} open={open}>
                          <MessengerLogo className="text-[28px]" />
                        </HeaderIconButtonWithBadge>
                      </Popover.Trigger>
                      <Popover.Panel className="mt-4 w-96 rounded-[20px] border-t border-neutral-90 px-0 py-4 shadow-popover">
                        <MessengerPopover
                          conversations={conversations}
                          onSeeAllMessagesClick={() => router.push('/messages')}
                          onItemClick={close}
                        />
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
                {!isLoading && !error && <NotificationPopover unreadNotifCount={data ? data.unseenCount : 0} />}
                <div className="ml-2">
                  <AvatarPopover />
                </div>
                <LocaleSwitcher />
              </div>
            )}
      </header>
    </>
  );
};

export default Header;
