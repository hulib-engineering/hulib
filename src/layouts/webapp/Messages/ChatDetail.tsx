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
import React, { useEffect, useRef } from 'react';

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

export default function ChatDetail({ onBack, isTypeFixed = false }: { isTypeFixed?: boolean; onBack?: () => void }) {
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
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container || !data || !data[0] || data[0]?.direction !== 'received') {
      return;
    }

    const markAsRead = () => {
      const isScrollable = container.scrollHeight > container.clientHeight;
      const atBottom = container.scrollTop <= 10;

      if (!isScrollable || atBottom) {
        emit('read', { senderId: Number(currentOpeningChat?.id) });
        dispatch(chatApi.util.invalidateTags([{ type: 'Messages', id: `LIST-${currentOpeningChat?.id}` }]));
      }
    };

    container.addEventListener('scroll', markAsRead);
    // Check immediately, in case there are not enough messages to scroll
    markAsRead();

    return () => {
      container.removeEventListener('scroll', markAsRead);
    };
  }, [data, currentOpeningChat?.id, emit, dispatch]);

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
        <div className="flex gap-4 border-t border-neutral-90 bg-white px-[13px] py-[11px] shadow-sm">
          <Avatar size="lg" imageUrl={currentOpeningChat?.avatarUrl}>
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
          className="flex max-h-screen flex-1 flex-col-reverse overflow-y-auto"
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
