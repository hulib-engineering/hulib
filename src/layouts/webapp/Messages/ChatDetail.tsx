'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import {
  differenceInMinutes,
  format,
  isThisWeek,
  isToday,
  isYesterday,
} from 'date-fns';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import { MessengerInput } from '@/components/messages/MessengerInput';
import StatusBadge from '@/components/StatusBadge';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';
import {
  chatApi,
  useGetConversationQuery,
  useGetUserOnlineStatusQuery,
} from '@/libs/services/modules/chat';
import type { TransformedMessage } from '@/libs/services/modules/chat/getConversationByUserId';

type ChatItem =
  | { type: 'separator'; label: string }
  | { type: 'message'; message: TransformedMessage };

export function groupMessagesByTime(
  messages: TransformedMessage[],
  gapMinutes = 5,
): ChatItem[] {
  const result: ChatItem[] = [];
  let lastTimestamp: Date | null = null;

  for (const msg of messages) {
    const timestamp = new Date(msg.time);

    const shouldInsertSeparator
      = !lastTimestamp
        || differenceInMinutes(timestamp, lastTimestamp) > gapMinutes;

    if (shouldInsertSeparator) {
      const datePart = isToday(timestamp)
        ? 'Today'
        : isYesterday(timestamp)
          ? 'Yesterday'
          : isThisWeek(timestamp)
            ? format(timestamp, 'EEEE')
            : format(timestamp, 'MMM dd, yyyy');

      const timePart = format(timestamp, 'hh:mm a');

      result.push({
        type: 'separator',
        label: `${datePart} ${timePart}`,
      });

      lastTimestamp = timestamp;
    }

    result.push({ type: 'message', message: msg });
    lastTimestamp = timestamp;
  }

  return result;
}

export const MessageItem = React.memo(({
  type,
  participantAvatarUrl,
  participantName,
  markedAsRead = false,
  children,
}: WithChildren<{
  type: 'sent' | 'received';
  participantAvatarUrl?: string;
  participantName?: string;
  markedAsRead?: boolean;
}>) => (
  <div
    className={mergeClassnames(
      'flex flex-col gap-1 px-5 py-2',
      markedAsRead && 'items-end',
    )}
  >
    <div
      className={mergeClassnames(
        'flex',
        type === 'sent' ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={mergeClassnames(
          'max-w-5/6 p-2.5 leading-normal tracking-tight',
          type === 'sent'
            ? 'rounded-bl-2xl rounded-tr-2xl bg-primary-60 text-primary-98'
            : 'bg-primary-90 rounded-tl-2xl rounded-br-2xl text-black',
        )}
      >
        {children}
      </div>
    </div>
    {markedAsRead && (
      <Avatar
        imageUrl={participantAvatarUrl}
        name={participantName}
        className="size-5"
      />
    )}
  </div>
));
MessageItem.displayName = 'MessageItem';

export default function ChatDetail({ onBack, isTypeFixed = false }: { isTypeFixed?: boolean; onBack?: () => void }) {
  const currentOpeningChat = useAppSelector(
    state => state.messenger.currentChatDetail,
  );
  const userInfo = useAppSelector(state => state.auth.userInfo);

  const dispatch = useAppDispatch();

  const { data: isOnline } = useGetUserOnlineStatusQuery(
    currentOpeningChat?.id,
    {
      skip: !currentOpeningChat,
      pollingInterval: 10 * 60 * 1000,
    },
  );
  const { data } = useGetConversationQuery(currentOpeningChat?.id, {
    skip: !currentOpeningChat,
  });
  const reversedData = data ? data.toReversed() : [];
  const groupedMessages = groupMessagesByTime(reversedData);
  const lastReadMessageId
    = (data
      && data?.filter(
        (msg: TransformedMessage) => msg.direction === 'sent' && msg.isRead,
      )[0]?.id)
      ?? null;

  const emitRef = useRef<(event: string, ...args: any[]) => void>(() => {});
  const isVisibleRef = useRef(true);
  const lastAckedUnreadIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handler);
    isVisibleRef.current = document.visibilityState === 'visible';
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const handleReceiveMessage = useCallback(
    (payload: { id: number; from: number; to: number; msg: string; time: number }) => {
      if (!currentOpeningChat || payload.from !== Number(currentOpeningChat.id)) {
        return;
      }
      const isVisible = isVisibleRef.current;
      dispatch(
        chatApi.util.updateQueryData(
          'getConversation',
          Number(currentOpeningChat.id),
          (draft) => {
            if (draft.some((m: TransformedMessage) => m.id === String(payload.id))) {
              return;
            }
            draft.unshift({
              id: String(payload.id),
              from: payload.from,
              to: payload.to,
              msg: payload.msg,
              chatType: 'txt',
              time: new Date(payload.time).toISOString(),
              direction: 'received' as const,
              isRead: isVisible,
            });
          },
        ),
      );
      if (isVisible) {
        emitRef.current('read', { senderId: payload.from });
        dispatch(chatApi.util.invalidateTags([
          { type: 'Messages', id: `LIST-${currentOpeningChat.id}` },
          { type: 'Messages', id: 'LIST' },
        ]));
      }
    },
    [currentOpeningChat, dispatch],
  );

  const { emit, isConnected } = useSocket({
    namespace: 'chat',
    listeners: {
      receive: handleReceiveMessage,
    },
  });

  emitRef.current = emit;

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0;
    }
  }, [data]);
  useEffect(() => {
    if (!data || !currentOpeningChat || !emit || !isVisibleRef.current) {
      return;
    }
    const newestUnreadId
      = data.find(
        (m: TransformedMessage) => m.direction === 'received' && !m.isRead,
      )?.id ?? null;
    if (!newestUnreadId || newestUnreadId === lastAckedUnreadIdRef.current) {
      return;
    }
    lastAckedUnreadIdRef.current = newestUnreadId;

    dispatch(
      chatApi.util.updateQueryData(
        'getConversation',
        Number(currentOpeningChat.id),
        (draft) => {
          draft.forEach((m: TransformedMessage) => {
            if (m.direction === 'received' && !m.isRead) {
              m.isRead = true;
            }
          });
        },
      ),
    );

    emit('read', { senderId: Number(currentOpeningChat.id) });
    dispatch(chatApi.util.invalidateTags([
      { type: 'Messages', id: `LIST-${currentOpeningChat.id}` },
      { type: 'Messages', id: 'LIST' },
    ]));
  }, [data, currentOpeningChat, emit, dispatch]);

  const playSentMessageSound = () => {
    const audio = new Audio('/assets/media/message-sent.mp3');
    audio.play().catch((e) => {
      console.warn('Audio play blocked:', e);
    });
  };
  const handleSendMessage = useCallback(
    async (id: string, text: string, type?: 'txt' | 'img') => {
      if (!text.trim() || !userInfo) {
        return;
      }

      if (!isConnected) {
        console.warn('[Chat] Cannot send — not connected');
        return;
      }

      dispatch(
        chatApi.util.updateQueryData(
          'getConversation',
          Number(id),
          (draft) => {
            draft.unshift({
              id: `-${Date.now()}`,
              from: Number(userInfo.id),
              to: Number(id),
              msg: text,
              chatType: type ?? 'txt',
              time: new Date().toISOString(),
              direction: 'sent' as const,
              isRead: false,
            });
          },
        ),
      );

      emit('send', { recipientId: id, message: text, chatType: type ?? 'txt' });

      dispatch(
        chatApi.util.invalidateTags([{ type: 'Messages', id: `LIST-${id}` }]),
      );

      playSentMessageSound();
    },
    [isConnected, emit, dispatch, userInfo],
  );

  if (!currentOpeningChat) {
    return undefined;
  }

  return (
    <div className="flex size-full flex-1 flex-col">
      <div className="w-full bg-white lg:hidden">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <div className="flex items-center gap-1.5 text-black">
            <ArrowLeft />
            <span>Back</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-1 flex-col bg-green-98">
        <div className="flex gap-4 border-neutral-90 bg-white px-[13px] py-[11px] shadow-sm md:border-t">
          <Avatar
            size="lg"
            imageUrl={currentOpeningChat?.avatarUrl}
            name={currentOpeningChat?.name}
          >
            <Avatar.Status>
              <StatusBadge onLine={isOnline} />
            </Avatar.Status>
          </Avatar>
          <span className="text-2xl font-bold text-black">
            {currentOpeningChat?.name}
          </span>
        </div>
        <div
          ref={messageContainerRef}
          className="flex flex-1 flex-col-reverse overflow-y-auto"
        >
          {groupedMessages.reverse().map((item, index) => {
            if (item.type === 'separator') {
              return (
                <div
                  key={`separator-${index}`}
                  className="py-2 text-center text-sm leading-5 text-neutral-30"
                >
                  {item.label}
                </div>
              );
            }

            const { message } = item;
            if (message.chatType === 'img') {
              return (
                <div
                  key={message.id}
                  className={mergeClassnames(
                    'flex',
                    message.direction === 'sent' ? 'justify-end' : 'justify-start',
                  )}
                >
                  <Image
                    alt={`Sticker ${message.msg}`}
                    width={120}
                    height={120}
                    className="size-[120px] object-contain"
                    src={message.stickerUrl ?? ''}
                  />
                </div>
              );
            }
            return (
              <MessageItem
                key={message.id}
                type={message.direction}
                participantAvatarUrl={currentOpeningChat?.avatarUrl}
                participantName={currentOpeningChat?.name}
                markedAsRead={
                  message.id === lastReadMessageId
                  && message.direction === 'sent'
                  && message.isRead
                }
              >
                {message.msg}
              </MessageItem>
            );
          })}
        </div>
      </div>
      <MessengerInput
        onSend={(value, type) =>
          handleSendMessage(currentOpeningChat?.id, value, type)}
        outerStickerPicker={!isTypeFixed}
        // className={mergeClassnames(isTypeFixed && 'fixed bottom-0 left-0 right-0 z-10')}
      />
    </div>
  );
}
