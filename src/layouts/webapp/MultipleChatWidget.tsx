'use client';

import { Minus, X } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';

import { MessageItem } from './Messages/ChatDetail';
import IconButton from '@/components/iconButton/IconButton';
import { MessengerInput } from '@/components/messages/MessengerInput';
import { mergeClassnames } from '@/components/private/utils';
import StatusBadge from '@/components/StatusBadge';
import Tooltip from '@/components/tooltip/Tooltip';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useSocket } from '@/libs/hooks/useSocket';
import type { MessageResponse } from '@/libs/services/modules/chat';
import { chatApi, useGetConversationQuery } from '@/libs/services/modules/chat';
import type { TransformedMessage } from '@/libs/services/modules/chat/getConversation';
import { closeChat, minimizeChat, restoreChat } from '@/libs/store/messenger';

type IChatBubbleProps = {
  id: string;
  participant: { avatarUrl?: string; name: string };
  unreadCount: number;
  lastMessage?: MessageResponse;
  toggleChat: (id: string) => void;
  onCloseChat?: (id: string) => void;
};

const ChatBubble = (props: IChatBubbleProps) => {
  const direction
    = `${props.lastMessage?.recipientId}` === props.id ? 'received' : 'sent';
  const [isHovering, setIsHovering] = useState(false);

  const onMouseEnter = useCallback(() => setIsHovering(true), [setIsHovering]);
  const onMouseLeave = useCallback(() => setIsHovering(false), [setIsHovering]);

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <button
          type="button"
          onClick={() => props.toggleChat(props.id)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="relative size-14 rounded-full bg-transparent p-0"
        >
          <Image
            src={
              props.participant.avatarUrl
              || '/assets/images/ava-placeholder.png'
            }
            alt={props.participant.name}
            width={56}
            height={56}
            className="rounded-full object-cover object-center"
          />
          {props.unreadCount > 0 && (
            <span
              className={mergeClassnames(
                'absolute left-0 top-0 flex size-5 items-center justify-center rounded-full border',
                'border-white bg-red-50 px-1 py-[0.5px] text-[10px] font-medium leading-3 text-white',
                isHovering && 'hidden',
              )}
            >
              {props.unreadCount}
            </span>
          )}
          <IconButton
            size="sm"
            className={mergeClassnames(
              'z-10 absolute -right-[6px] -top-3 hidden !size-6 items-center justify-center rounded-full p-2',
              'bg-neutral-98 text-neutral-20',
              isHovering && 'flex',
            )}
            onClick={() => props.onCloseChat && props.onCloseChat(props.id)}
          >
            <X className="size-2" />
          </IconButton>
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content
        position="left"
        className="max-w-[221px] rounded-bl-2xl rounded-tr-2xl bg-primary-98 px-3 py-2 shadow-tooltip"
      >
        <div className="flex flex-col gap-1">
          {props.lastMessage?.chatType.name === 'txt'
            ? (
                <p className="line-clamp-1 truncate text-sm leading-5 text-neutral-20">
                  {`${
                    direction === 'sent' ? 'You:' : ''
                  } ${props.lastMessage?.message || ''}`}
                </p>
              )
            : (
                <p>
                  {direction === 'sent' ? 'You sent a sticker' : 'Sent a sticker'}
                </p>
              )}
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};

type IChatWindowProps = {
  participant: { id: string; name: string; avatarUrl?: string };
  onSend: (id: string, message: string, type?: 'txt' | 'img') => void;
  onClose: () => void;
  onMinimize: () => void;
  id: string;
};

const ChatWindow = (props: IChatWindowProps) => {
  const { data } = useGetConversationQuery(props.id);

  return (
    <div className="flex h-[576px] w-[391px] flex-col overflow-hidden rounded-2xl bg-white shadow-popup">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary-70 p-3 text-neutral-98">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              className="size-[36px] rounded-full"
              src={
                props.participant.avatarUrl
                ?? '/assets/images/ava-placeholder.png'
              }
              alt="Sender Avatar"
              width={36}
              height={36}
              objectFit="cover"
              objectPosition="center"
              quality={100}
              placeholder="blur"
              blurDataURL="/assets/images/ava-placeholder.png"
            />
            <StatusBadge
              onLine
              className="absolute bottom-[-6px] right-[-6px]"
            />
          </div>
          <span className="text-[18px] font-bold leading-7">
            {props.participant.name}
          </span>
        </div>
        <div className="flex gap-6">
          <Minus className="size-8 cursor-pointer" onClick={props.onMinimize} />
          <X className="size-8 cursor-pointer" onClick={props.onClose} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto bg-green-98 p-3 text-xs leading-5 text-neutral-30">
        {data
        && data.map((each: TransformedMessage) => {
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
            <MessageItem key={each.id} type={each.direction}>
              {each.msg}
            </MessageItem>
          );
        })}
      </div>

      {/* Input */}
      <MessengerInput
        onSend={(value, type) => props.onSend(props.id, value, type)}
      />
    </div>
  );
};

export default function MessengerWidget() {
  const chats = useAppSelector(state => state.messenger.chats);

  const dispatch = useAppDispatch();

  const { emit, isConnected } = useSocket({ namespace: 'chat', listeners: {} });

  const handleCloseChat = (id: string) => {
    dispatch(closeChat(id));
  };
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
  const openChats = chats.filter(chat => chat.isOpen && !chat.isMinimized);
  const closedChats = chats.filter(chat => !chat.isOpen || chat.isMinimized);
  const handleMinimizeChat = (id: string) => {
    dispatch(minimizeChat(id));
  };
  const handleRestoreChat = (id: string) => {
    dispatch(restoreChat(id));
  };

  return (
    <>
      {/* Chat Windows - aligned horizontally leftward like Messenger */}
      <div className="fixed bottom-1.5 right-28 z-50 flex flex-row-reverse gap-4">
        {openChats.map(chat => (
          <ChatWindow
            key={chat.id}
            id={chat.id}
            participant={{
              id: chat.id,
              name: chat.name,
              avatarUrl: chat.avatarUrl,
            }}
            onSend={(_id, text, type) => handleSendMessage(chat.id, text, type)}
            onClose={() => handleCloseChat(chat.id)}
            onMinimize={() => handleMinimizeChat(chat.id)}
          />
        ))}
      </div>

      {/* Chat Bubbles - fixed to bottom-right */}
      <div className="fixed bottom-14 right-6 z-50 flex flex-col items-end gap-4">
        {closedChats.map(chat => (
          <ChatBubble
            key={chat.id}
            id={chat.id}
            participant={{ name: chat.name, avatarUrl: chat.avatarUrl }}
            unreadCount={chat.unread}
            lastMessage={chat.lastMessage}
            toggleChat={handleRestoreChat}
            onCloseChat={handleCloseChat}
          />
        ))}
      </div>
    </>
  );
}
