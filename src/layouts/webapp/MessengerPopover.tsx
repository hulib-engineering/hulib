import React from 'react';
import type { Contact } from '@/libs/services/modules/chat';
import { useAppDispatch } from '@/libs/hooks';
import { openChat } from '@/libs/store/messenger';
import { ContactItem } from '@/layouts/webapp/Messages/ChatList';
import Button from '@/components/core/button/Button';

const MessengerPopover = ({
  conversations = [],
  onSeeAllMessagesClick,
  onItemClick,
}: {
  conversations: Contact[];
  onSeeAllMessagesClick: () => void;
  onItemClick?: () => void;
}) => {
  const dispatch = useAppDispatch();

  const handleMessageItemClick = ({
    participant,
    unreadCount,
    lastMessage,
  }: Omit<Contact, 'id' | 'isOnline'>) => {
    if (onItemClick) {
      onItemClick();
    }
    dispatch(
      openChat({
        id: participant.id.toString(),
        name: participant.fullName,
        avatarUrl: participant.photo?.path,
        isOpen: true,
        isMinimized: false,
        unread: unreadCount,
        lastMessage,
      }),
    );
  };

  return (
    <div data-testid="messenger-popover-content" className="flex flex-col">
      <div className="px-5 pb-2 text-2xl font-bold leading-8">
        Your messages
      </div>
      {conversations.length === 0
        ? (
            <div className="flex flex-1 items-center justify-center">
              You have no conversations yet!
            </div>
          )
        : (
            <>
              <div className="flex h-[280px] flex-col overflow-y-auto">
                {conversations.map(({ unreadCount, lastMessage, ...rest }) => (
                  <ContactItem
                    key={rest.participant.id}
                    {...rest}
                    lastMessage={{ ...lastMessage, isRead: !!lastMessage.readAt }}
                    onClick={() =>
                      handleMessageItemClick({
                        participant: rest.participant,
                        unreadCount,
                        lastMessage,
                      })}
                  />
                ))}
              </div>
              <div className="px-2.5">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={onSeeAllMessagesClick}
                >
                  See all
                </Button>
              </div>
            </>
          )}
    </div>
  );
};

export default MessengerPopover;
