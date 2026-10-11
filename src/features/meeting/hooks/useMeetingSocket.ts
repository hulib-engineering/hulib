'use client';

import { useCallback, useState } from 'react';

import { useSocket } from '@/libs/hooks/useSocket';
import type { TransformedMessage } from '@/libs/services/modules/chat/getConversationByUserId';
import { ChatTypeMap } from '@/libs/services/modules/chat';

export type InCallMessage = Omit<TransformedMessage, 'id'>;

type ChatInCallPayload = Omit<TransformedMessage, 'id'> & {
  content: string;
  timestamp: string;
};

type UseMeetingSocketOptions = {
  remoteParticipantId?: string | number;
  isChatOpen: boolean;
};

/**
 * Single owner of the room's socket traffic.
 *
 * Reactions and in-call chat previously each opened their own `useSocket` handle
 * on the default namespace, taking two separate refcounts against the same shared
 * socket. Consolidating them here means one lifecycle for the whole room.
 */
export function useMeetingSocket({
  remoteParticipantId,
  isChatOpen,
}: UseMeetingSocketOptions) {
  const [messages, setMessages] = useState<InCallMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isReactionReceived, setIsReactionReceived] = useState(false);
  const [isRemoteCallEnded, setIsRemoteCallEnded] = useState(false);

  const { emit } = useSocket({
    namespace: '',
    listeners: {
      reaction: () => {
        setIsReactionReceived(true);
        setTimeout(() => setIsReactionReceived(false), 5000);
      },
      'call-ended': () => {
        setIsRemoteCallEnded(true);
      },
      'chat-in-call:receive': (payload: ChatInCallPayload) => {
        setMessages(previous => [...previous, {
          ...payload,
          msg: payload.content,
          direction: 'received',
          time: payload.timestamp,
          // A message that arrives while the panel is open has been seen.
          isRead: isChatOpen,
        }]);

        if (!isChatOpen) {
          setUnreadCount(count => count + 1);
        }
      },
    },
  });

  const openChat = useCallback(() => {
    setUnreadCount(0);
    setMessages(previous => previous.map(message => (
      message.direction === 'received' ? { ...message, isRead: true } : message
    )));
  }, []);

  const sendMessage = useCallback((message: string, messageType?: 'txt' | 'img') => {
    if (!message) {
      return;
    }

    setMessages(previous => [...previous, {
      to: Number(remoteParticipantId),
      from: 0,
      msg: message,
      chatType: messageType || 'txt',
      direction: 'sent',
      time: new Date().toISOString(),
      isRead: false,
    } as InCallMessage]);

    emit('chat-in-call:send', {
      recipientId: remoteParticipantId,
      message,
      chatType: { id: ChatTypeMap[messageType || 'txt'] },
    });
  }, [emit, remoteParticipantId]);

  const sendReaction = useCallback(() => {
    emit('reaction', { recipientId: remoteParticipantId });
  }, [emit, remoteParticipantId]);

  /** Tells the other side the call is over so they are not left on a dead stage. */
  const notifyCallEnded = useCallback(() => {
    emit('call-ended', { recipientId: remoteParticipantId });
  }, [emit, remoteParticipantId]);

  return {
    messages,
    unreadCount,
    isReactionReceived,
    isRemoteCallEnded,
    setIsRemoteCallEnded,
    openChat,
    sendMessage,
    sendReaction,
    notifyCallEnded,
  };
}