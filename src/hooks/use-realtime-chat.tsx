'use client';

import { useCallback, useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = 'message';

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newRoomName = `${roomName}+${Date.now()}`;

    const newChannel = supabase.channel(newRoomName);
    console.log(`Creating channel for room: ${newRoomName}`);

    newChannel
      .on('broadcast', { event: EVENT_MESSAGE_TYPE }, (payload) => {
        console.log(`Received message in room ${newRoomName}:`, payload);
        setMessages((current) => [...current, payload.payload as ChatMessage]);
      })
      .subscribe(async (status) => {
        console.log(`Channel ${newRoomName} subscription status:`, status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        }
      });

    setChannel(newChannel);

    return () => {
      console.log(`Unsubscribing from channel for room: ${newRoomName}`);
      supabase.removeChannel(newChannel);
    };
  }, [roomName]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        user: {
          name: username,
        },
        createdAt: new Date().toISOString(),
      };

      // Update local state immediately for the sender
      setMessages((current) => [...current, message]);

      await channel.send({
        type: 'broadcast',
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
    },
    [channel, isConnected, username]
  );

  return { messages, sendMessage, isConnected };
}
