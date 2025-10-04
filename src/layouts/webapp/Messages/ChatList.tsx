'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import Fuse from 'fuse.js';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import type z from 'zod';

import { mergeClassnames } from '@/components/core/private/utils';
import StatusBadge from '@/components/StatusBadge';
import TextInput from '@/components/core/textInput/TextInput';
import { useAppDispatch, useDebounce } from '@/libs/hooks';
import type { Contact } from '@/libs/services/modules/chat';
import { useGetConversationContactsQuery } from '@/libs/services/modules/chat';
import { openChatDetail } from '@/libs/store/messenger';
import { formatRelativeTime } from '@/utils/dateUtils';
import type { ProfileValidation } from '@/validations/ProfileValidation';

type IContactItemProps = {
  participant: z.infer<typeof ProfileValidation> & {
    id: number;
    photo: { id: string; path: string };
  };
  lastMessage: {
    recipientId: number;
    message: string;
    createdAt: string;
    isRead: boolean;
  };
  isOnline?: boolean;
  onClick: () => void;
};

export const ContactItem = ({
  participant,
  lastMessage,
  isOnline = false,
  onClick,
}: IContactItemProps) => (
  <button
    type="button"
    className="flex gap-[11px] bg-white p-2.5"
    onClick={onClick}
  >
    <div className="relative">
      <Image
        className="size-14 rounded-full"
        src={participant.photo?.path ?? '/assets/images/ava-placeholder.png'}
        alt="Sender Avatar"
        width={56}
        height={56}
        objectFit="cover"
        objectPosition="center"
        quality={100}
        placeholder="blur"
        blurDataURL="/assets/images/ava-placeholder.png"
      />
      <StatusBadge onLine={isOnline} className="absolute bottom-0 right-0" />
    </div>
    <div className="flex flex-1 flex-col justify-center gap-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold leading-6 tracking-tight text-black">
          {participant.fullName ?? 'Unknown'}
        </p>
        <p
          className={mergeClassnames(
            'text-xs font-medium leading-[14px]',
            lastMessage.isRead ? 'text-neutral-70' : 'text-primary-60',
          )}
        >
          {formatRelativeTime(new Date(lastMessage.createdAt).getTime())}
        </p>
      </div>
      <p
        className={mergeClassnames(
          'text-left text-sm leading-none line-clamp-2',
          lastMessage.isRead ? 'text-neutral-50' : 'font-medium text-black',
        )}
      >
        {`${lastMessage.recipientId === participant.id ? 'You: ' : ''}${
          lastMessage.message
        }`}
      </p>
    </div>
  </button>
);

export default function ChatList() {
  const { data: conversations = [] } = useGetConversationContactsQuery();

  const dispatch = useAppDispatch();

  const [qString, setQString] = useState('');

  const debouncedSearch = useDebounce(qString, 300);

  const filteredConversations = useMemo(() => {
    const normalizeText = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
        .toLowerCase();

    if (!debouncedSearch) {
      return conversations;
    }

    const fuse = new Fuse(conversations, {
      keys: ['participant.fullName'],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
      useExtendedSearch: true,
      getFn: (obj: Contact) => normalizeText(obj.participant.fullName),
    });

    return fuse.search(normalizeText(debouncedSearch)).map(res => res.item);
  }, [qString, conversations]);

  useEffect(() => {
    if (conversations.length === 0) {
      return;
    }
    const latestConversation = conversations[0];

    dispatch(
      openChatDetail({
        id: latestConversation.participant.id,
        name: latestConversation.participant.fullName,
        avatarUrl: latestConversation.participant.photo?.path,
      }),
    );
  }, [conversations]);

  return (
    <>
      <div className="px-4 py-2 pt-0">
        <TextInput
          name="search"
          type="text"
          placeholder="Search for name"
          icon={<MagnifyingGlass size={24} />}
          onChange={event => setQString(event.target.value)}
        />
      </div>
      <div className="flex flex-col overflow-y-auto">
        {filteredConversations.map((contact: Contact) => (
          <ContactItem
            key={contact.participant.id}
            {...contact}
            lastMessage={{
              ...contact.lastMessage,
              isRead: !!contact.lastMessage.readAt,
            }}
            onClick={() =>
              dispatch(
                openChatDetail({
                  id: `${contact.participant.id}`,
                  name: contact.participant.fullName,
                  avatarUrl: contact.participant.photo?.path,
                }),
              )}
          />
        ))}
      </div>
    </>
  );
}
