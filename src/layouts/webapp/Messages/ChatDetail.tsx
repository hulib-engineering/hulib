'use client';

import {
  differenceInMinutes,
  format,
  isThisWeek,
  isToday,
  isYesterday,
} from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

import { MessengerInput } from '@/components/messages/MessengerInput';
import type { WithChildren } from '@/components/core/private/types';
import { mergeClassnames } from '@/components/core/private/utils';
import StatusBadge from '@/components/StatusBadge';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';
import {
  chatApi,
  useGetConversationQuery,
  useGetUserOnlineStatusQuery,
} from '@/libs/services/modules/chat';
import type { TransformedMessage } from '@/libs/services/modules/chat/getConversationByUserId';

export type ChatItem =
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

export const MessageItem = ({
  type,
  participantAvatarUrl,
  markedAsRead = false,
  children,
}: WithChildren<{
  type: 'sent' | 'received';
  participantAvatarUrl?: string;
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
      <Image
        className="size-5 rounded-full"
        src={participantAvatarUrl ?? '/assets/images/ava-placeholder.png'}
        alt="Sender Avatar"
        width={20}
        height={20}
        objectFit="cover"
        objectPosition="center"
        quality={100}
        placeholder="blur"
        blurDataURL="/assets/images/ava-placeholder.png"
      />
    )}
  </div>
);

export default function ChatDetail() {
  const currentOpeningChat = useAppSelector(
    state => state.messenger.currentChatDetail,
  );

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

  const { emit, isConnected } = useSocket({ namespace: 'chat', listeners: {} });

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0;
    }
  }, [data]);

  const playSentMessageSound = () => {
    const audio = new Audio('/assets/media/message-sent.mp3');
    audio.play().catch((e) => {
      console.warn('Audio play blocked:', e);
    });
  };
  const handleSendMessage = async (
    id: string,
    text: string,
    type?: 'txt' | 'img',
  ) => {
    if (!text.trim()) {
      return;
    }

    if (!isConnected) {
      console.warn('[Chat] Cannot send — not connected');
      return;
    }
    emit('send', { recipientId: id, message: text, chatType: type ?? 'txt' });

    dispatch(
      chatApi.util.invalidateTags([{ type: 'Messages', id: `LIST-${id}` }]),
    );

    playSentMessageSound();
  };

  if (!currentOpeningChat) {
    return undefined;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex gap-4 bg-white px-[13px] py-[11px] shadow-sm">
        <div className="relative">
          <Image
            className="size-12 rounded-full"
            src={
              currentOpeningChat?.avatarUrl
              ?? '/assets/images/ava-placeholder.png'
            }
            alt="Sender Avatar"
            width={48}
            height={48}
            objectFit="cover"
            objectPosition="center"
            quality={100}
            placeholder="blur"
            blurDataURL="/assets/images/ava-placeholder.png"
          />
          <StatusBadge
            onLine={isOnline}
            className="absolute bottom-[-6px] right-[-6px]"
          />
        </div>
        <span className="text-2xl font-bold text-black">
          {currentOpeningChat?.name}
        </span>
      </div>
      <div
        ref={messageContainerRef}
        className="flex max-h-[604px] flex-1 flex-col-reverse overflow-y-auto"
      >
        {data && data.map((each: TransformedMessage) => {
          if (each.chatType === 'img') {
            return (
              <div
                key={each.id}
                className={mergeClassnames(
                  'flex',
                  each.direction === 'sent' ? 'justify-end' : 'justify-start',
                )}
              >
                <Image
                  alt={`Sticker ${each.msg}`}
                  width={120}
                  height={120}
                  className="size-[120px] object-contain"
                  src={each.stickerUrl ?? ''}
                />
              </div>
            );
          }
          return (
            <MessageItem
              key={each.id}
              type={each.direction}
              participantAvatarUrl={currentOpeningChat?.avatarUrl}
              markedAsRead={each.direction === 'sent' && each.isRead}
            >
              {each.msg}
            </MessageItem>
          );
        })}
      </div>
      <MessengerInput
        onSend={(value, type) =>
          handleSendMessage(currentOpeningChat?.id, value, type)}
        outerStickerPicker
      />
    </div>
  );
}
