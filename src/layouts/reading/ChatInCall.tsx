'use client';

import * as React from 'react';
import { X } from '@phosphor-icons/react';

import { Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MessengerInput } from '@/components/messages/MessengerInput';
import { useSocket } from '@/libs/hooks/useSocket';
import { ChatTypeMap } from '@/libs/services/modules/chat';
import type { TransformedMessage } from '@/libs/services/modules/chat/getConversationByUserId';
import { mergeClassnames } from '@/components/private/utils';
import { MessageItem } from '@/layouts/webapp/Messages/ChatDetail';
import { useAppSelector } from '@/libs/hooks';

type IChatInCallProps = {
  isShow: boolean;
  participantId: number;
  participantAvatarUrl?: string;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
};

export default function ChatInCall({ isShow, participantId, participantAvatarUrl, onClose, onUnreadCountChange }: IChatInCallProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  const userInfo = useAppSelector(state => state.auth.userInfo);

  const [messages, setMessages] = useState<(Omit<TransformedMessage, 'id'>)[]>([]);

  useEffect(() => {
    if (isShow) {
      // Mark all received messages as read
      setMessages(prev =>
        prev.map(msg =>
          msg.direction === 'received' ? { ...msg, isRead: true } : msg,
        ),
      );
      onUnreadCountChange(0);
    } else {
      // Count only unread received messages
      const count = messages.filter(
        msg => msg.direction === 'received' && !msg.isRead,
      ).length;
      onUnreadCountChange(count);
    }
  }, [messages.length, onUnreadCountChange]);

  const { emit } = useSocket({
    namespace: '',
    listeners: {
      'chat-in-call:receive': (payload: Omit<TransformedMessage, 'id'> & { content: string; timestamp: string }) => {
        setMessages(prev => [...prev, {
          ...payload,
          msg: payload.content,
          direction: 'received',
          time: payload.timestamp,
          isRead: isShow,
        }]);
      },
    },
  });

  const handleSendMessage = (message: string, messageType?: 'txt' | 'img') => {
    setMessages(prev => [...prev, {
      to: participantId,
      from: Number(userInfo.id),
      msg: message,
      chatType: messageType || 'txt',
      direction: 'sent',
      time: new Date().toISOString(),
      isRead: false,
    }]);
    emit('chat-in-call:send', {
      recipientId: participantId,
      message,
      chatType: { id: ChatTypeMap[messageType || 'txt'] },
    });
  };

  return (
    <Transition
      show={isShow}
      as={Fragment}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-4 scale-95"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 translate-y-4 scale-95"
    >
      <div className="flex size-full flex-col overflow-hidden rounded-[20px] rounded-tr-none bg-neutral-90 shadow-popover xl:h-auto xl:w-1/3">
        <div className="flex items-center justify-between bg-white px-3 py-2 text-neutral-10">
          <X className="invisible size-7" />
          <h6 className="text-xl font-medium">{t('chat')}</h6>
          <X className="size-7 cursor-pointer text-[#343330]" onClick={onClose} />
        </div>
        <div className="flex flex-1 flex-col bg-neutral-98">
          {messages.map((each) => {
            if (each.chatType === 'img') {
              return (
                <div
                  key={each.time}
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
                key={each.time}
                type={each.direction}
                participantAvatarUrl={participantAvatarUrl}
                markedAsRead={each.direction === 'sent' && each.isRead}
              >
                {each.msg}
              </MessageItem>
            );
          })}

        </div>
        <MessengerInput onSend={handleSendMessage} />
      </div>
    </Transition>
  );
}
