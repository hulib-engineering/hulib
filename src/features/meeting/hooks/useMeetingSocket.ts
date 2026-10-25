'use client';

import { useCallback, useState } from 'react';

import { useSocket } from '@/libs/hooks/useSocket';

type UseMeetingSocketOptions = {
  remoteParticipantId?: string | number;
};

/**
 * Owns the room's non-chat socket traffic: reactions and the call-ended signal.
 *
 * In-call chat deliberately stays in `ChatInCall`, which owns its own socket
 * handle and message list. Each surface keeping one handle matches how the room
 * has always worked, and `useSocket` refcounts the shared connection.
 */
export function useMeetingSocket({ remoteParticipantId }: UseMeetingSocketOptions) {
  const [isReactionReceived, setIsReactionReceived] = useState(false);
  const [isRemoteCallEnded, setIsRemoteCallEnded] = useState(false);

  const { emit } = useSocket({
    namespace: '',
    listeners: {
      'reaction': () => {
        setIsReactionReceived(true);
        setTimeout(() => setIsReactionReceived(false), 5000);
      },
      'call-ended': () => {
        setIsRemoteCallEnded(true);
      },
    },
  });

  const sendReaction = useCallback(() => {
    emit('reaction', { recipientId: remoteParticipantId });
  }, [emit, remoteParticipantId]);

  /** Tells the other side the call is over so they are not left on a dead stage. */
  const notifyCallEnded = useCallback(() => {
    emit('call-ended', { recipientId: remoteParticipantId });
  }, [emit, remoteParticipantId]);

  return {
    isReactionReceived,
    isRemoteCallEnded,
    setIsRemoteCallEnded,
    sendReaction,
    notifyCallEnded,
  };
}
