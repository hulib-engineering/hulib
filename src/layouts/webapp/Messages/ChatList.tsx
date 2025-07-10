'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import type z from 'zod';

import StatusBadge from '@/components/StatusBadge';
import TextInput from '@/components/textInput/TextInput';
import { useAppDispatch } from '@/libs/hooks';
import type { Contact } from '@/libs/services/modules/chat';
import { useGetConversationContactsQuery } from '@/libs/services/modules/chat';
import { openChatDetail } from '@/libs/store/messenger';
import { formatRelativeTime } from '@/utils/dateUtils';
import type { ProfileValidation } from '@/validations/ProfileValidation';

type IMessageItemProps = {
  participant: z.infer<typeof ProfileValidation> & {
    id: number;
    photo: { id: string; path: string };
  };
  lastMessage: {
    recipientId: number;
    message: string;
    createdAt: string;
  };
  onClick: () => void;
};

export const MessageItem = ({
  participant,
  lastMessage,
  onClick,
}: IMessageItemProps) => (
  <button
    type="button"
    className="flex gap-[11px] bg-white p-2.5"
    onClick={() => onClick()}
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
      <StatusBadge onLine={false} className="absolute bottom-0 right-0" />
    </div>
    <div className="flex flex-1 flex-col justify-center gap-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold leading-6 tracking-tight text-black">
          {participant.fullName ?? 'Unknown'}
        </p>
        <p className="text-xs font-medium leading-[14px] text-neutral-70">
          {formatRelativeTime(new Date(lastMessage.createdAt).getTime())}
        </p>
      </div>
      <p className="text-left text-sm font-medium leading-none text-black">
        {`${lastMessage.recipientId === participant.id ? 'You: ' : ''}${lastMessage.message}`}
      </p>
    </div>
  </button>
);

export default function ChatList() {
  const { data: conversations = [] } = useGetConversationContactsQuery();

  const dispatch = useAppDispatch();

  // const [qString, setQString] = useState('');

  useEffect(() => {
    if (conversations.length === 0) return;
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
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col overflow-y-auto">
        {conversations.map((contact: Contact) => (
          <MessageItem
            key={contact.participant.id}
            {...contact}
            onClick={() =>
              dispatch(
                openChatDetail({
                  id: `${contact.participant.id}`,
                  name: contact.participant.fullName,
                  avatarUrl: contact.participant.photo?.path,
                }),
              )
            }
          />
        ))}
      </div>
    </>
  );
}
