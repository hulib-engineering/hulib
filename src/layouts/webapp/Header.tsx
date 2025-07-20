'use client';

import {
  CaretDown,
  Gear,
  House,
  MessengerLogo,
  Pencil,
  SignOut,
  UserCircle,
} from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';
import React, { useCallback, useMemo } from 'react';

import Button from '@/components/button/Button';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Logo } from '@/components/Logo';
import MenuItem from '@/components/menuItem/MenuItem';
import Popover from '@/components/popover/Popover';
import { mergeClassnames } from '@/components/private/utils';
import SearchInput from '@/components/SearchInput';
import { ContactItem } from '@/layouts/webapp/Messages/ChatList';
import NotificationButton from '@/layouts/webapp/NotificationIcon';
import SkeletonHeader from '@/layouts/webapp/SkeletonHeader';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';
import {
  chatApi,
  type Contact,
  type MessageResponse,
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

type AvatarPopoverMenuItem = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type RenderProps = {
  open: boolean;
  close: () => void;
};

const AvatarPopoverContent: FC<RenderProps> = ({
  open,
  close,
}: RenderProps) => {
  const { role } = useAppSelector((state) => state.auth.userInfo);
  const t = useTranslations('HeaderWebApp');

  const handleClick = (item: AvatarPopoverMenuItem) => {
    if (open) {
      close();
    }
    item.onClick?.();
  };

  const AvatarPopoverMenuItems = useMemo(
    () => [
      {
        label: t('dashboard'),
        icon: <House size={20} color="primary-20" />,
        href: '/home',
        roles: [Role.ADMIN],
      },
      {
        label: t('my_profile'),
        icon: <UserCircle size={20} color="primary-20" />,
        href: '/profile',
        roles: [Role.LIBER, Role.HUBER],
      },
      {
        label: t('change_password'),
        icon: <Gear size={20} color="primary-20" />,
        href: '/change-password',
        roles: [Role.LIBER, Role.HUBER],
      },
      {
        label: t('register_huber'),
        icon: <Pencil size={20} color="primary-20" />,
        href: '/huber-registration',
        roles: [Role.LIBER],
      },
      {
        label: t('sign_out'),
        icon: <SignOut size={20} color="primary-20" />,
        onClick: () => signOut({ callbackUrl: '/auth/login' }),
      },
    ],
    [t],
  );

  const menuItemsByRole = useMemo(() => {
    return (
      AvatarPopoverMenuItems.filter((item) => {
        if (item?.roles) {
          return item.roles.includes(role?.id as Role);
        }
        return true;
      }) || []
    );
  }, [role]);

  return (
    <div data-testid="popover-content">
      {menuItemsByRole.map((item, index) =>
        item.href
          ? (
              <Link href={item.href} key={index} onClick={close}>
                <MenuItem>
                  {item.icon}
                  <MenuItem.Title>{item.label}</MenuItem.Title>
                </MenuItem>
              </Link>
            )
          : (
              <MenuItem key={index} onClick={() => handleClick(item)}>
                {item.icon}
                <MenuItem.Title>{item.label}</MenuItem.Title>
              </MenuItem>
            ),
      )}
    </div>
  );
};

const AvatarPopover = ({ children }: { children?: ReactNode }) => (
  <Popover position="bottom-end" className="h-full w-11">
    <Popover.Trigger
      data-testid="popover-trigger-arrow"
      {...{
        className: 'h-full',
      }}
    >
      {children}
    </Popover.Trigger>
    <Popover.Panel className="flex flex-col gap-1 p-2">
      {({ open = false, close }) => (
        <AvatarPopoverContent close={close} open={open} />
      )}
    </Popover.Panel>
  </Popover>
);

const MessengerPopover = ({
  conversations = [],
  onSeeAllMessagesClick,
  onItemClick,
}: {
  conversations: Contact[];
  onSeeAllMessagesClick: () => void;
  onItemClick?: () => void;
}) => {
  const dispatch = useAppDispatch();

  const handleMessageItemClick = ({
    participant,
    unreadCount,
    lastMessage,
  }: Omit<Contact, 'id' | 'isOnline'>) => {
    if (onItemClick) {
      onItemClick();
    }
    dispatch(
      openChat({
        id: participant.id.toString(),
        name: participant.fullName,
        avatarUrl: participant.photo?.path,
        isOpen: true,
        isMinimized: false,
        unread: unreadCount,
        lastMessage,
      }),
    );
  };

  return (
    <div data-testid="messenger-popover-content" className="flex flex-col">
      <div className="px-5 pb-2 text-2xl font-bold leading-8">
        Your messages
      </div>
      {conversations.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          You have no conversations yet!
        </div>
      ) : (
        <>
          <div className="flex h-[280px] flex-col overflow-y-auto">
            {conversations.map(({ unreadCount, lastMessage, ...rest }) => (
              <ContactItem
                key={rest.participant.id}
                {...rest}
                lastMessage={{ ...lastMessage, isRead: !!lastMessage.readAt }}
                onClick={() =>
                  handleMessageItemClick({
                    participant: rest.participant,
                    unreadCount,
                    lastMessage,
                  })
                }
              />
            ))}
          </div>
          <div className="px-2.5">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onSeeAllMessagesClick}
            >
              See all
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const HeaderIconButtonWithBadge = ({
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
      'relative w-fit rounded-[100px] p-2 text-[#343330] hover:bg-[#E3E4E5]',
      open && 'bg-[#CDDDFE] text-primary-50',
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
  const t = useTranslations('HeaderWebApp');

  const router = useRouter();

  const user = useAppSelector((state) => state.auth.userInfo);

  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 5 });
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

      // dispatch(
      //   addMessage({
      //     id: `${participantId}`,
      //     message: msg,
      //   }),
      // );

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

      playReceivedMessageSound(); // 🔊 Play sound on receive
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

  const renderNavbar = () => {
    if (!user || user?.role?.id === Role.ADMIN) {
      return null;
    }
    return (
      <div className="flex items-center justify-between gap-x-2">
        {user && user?.id && (
          <Link
            href="/schedule-meeting/weekly-schedule"
            className="mx-2 text-neutral-10"
          >
            {t('my_schedule')}
          </Link>
        )}
        <Link href="/explore-story" className="mx-2 text-neutral-10">
          {t('books')}
        </Link>
        <Link href="/explore-huber" className="mx-2 text-neutral-10">
          {t('mentors')}
        </Link>
      </div>
    );
  };

  return (
    <>
      <header className="flex w-screen flex-col gap-5 bg-white px-4 pb-2 pt-4 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:hidden">
        <div className="flex items-center justify-between">
          <Link href={user?.id ? '/home' : '/'}>
            <Logo size="small" />
          </Link>
          {!user || !user?.id ? (
            <div className="flex gap-3 px-10 ">
              <SkeletonHeader />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Popover position="bottom-start">
                {({ open, close }) => (
                  <>
                    <Popover.Trigger data-testid="messenger-popover-trigger">
                      <HeaderIconButtonWithBadge
                        badge={totalUnread}
                        open={open}
                      >
                        <MessengerLogo className="text-[28px]" />
                      </HeaderIconButtonWithBadge>
                    </Popover.Trigger>
                    <Popover.Panel className="flex flex-col gap-1 p-2">
                      <MessengerPopover
                        conversations={conversations}
                        onSeeAllMessagesClick={() => router.push('/messages')}
                        onItemClick={close}
                      />
                    </Popover.Panel>
                  </>
                )}
              </Popover>
              <NotificationButton
                notificationCount={!isLoading && data ? data.unseenCount : 0}
                notificationPath="/notification"
              />
              <div className="relative ml-2">
                <AvatarPopover>
                  <Image
                    alt="Avatar Icon"
                    width={44}
                    height={44}
                    loading="lazy"
                    src={user.photo?.path ?? '/assets/images/icons/avatar.svg'}
                    className="size-11 rounded-full object-contain"
                  />
                </AvatarPopover>
                <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
                  <CaretDown size={12} />
                </div>
              </div>
              <LocaleSwitcher className="shrink" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">{renderNavbar()}</div>
      </header>
      <header className="hidden w-screen items-center justify-between bg-white px-28 py-6 shadow-[0_0_6px_0_rgba(0,0,0,0.12)] lg:flex">
        <div className="flex items-center gap-6">
          <Link href={user?.id ? '/home' : '/'}>
            <Logo size="small" />
          </Link>
          {renderNavbar()}
        </div>
        <div className="w-[300px]">
          <SearchInput />
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
                <NotificationButton
                  notificationCount={!isLoading && data ? data.unseenCount : 0}
                  notificationPath="/notification"
                />
                <div className="relative ml-2 size-11">
                  <AvatarPopover>
                    <Image
                      alt="Avatar Icon"
                      layout="fill"
                      className="size-11 rounded-full object-contain"
                      loading="lazy"
                      // src={user.photo?.path ?? '/assets/images/ava-placeholder.png'}
                      src="/assets/images/ava-placeholder.png"
                    />
                  </AvatarPopover>
                  <div className="absolute left-7 top-7 rounded-full border border-solid border-white bg-neutral-90 p-0.5">
                    <CaretDown size={12} />
                  </div>
                </div>
                <LocaleSwitcher className="shrink" />
              </div>
            )}
      </header>
    </>
  );
};

export default Header;
