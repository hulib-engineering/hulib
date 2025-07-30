import type z from 'zod';

import { api } from '../../api';
import type { User } from '../auth';
import getConversation from './getConversationByUserId';
import getConversations from './getConversations';
import getUserOnlineStatus from './getUserOnlineStatus';
import type { ProfileValidation } from '@/validations/ProfileValidation';

export type MessageResponse = {
  id: string;
  recipientId: number;
  senderId: number;
  message: string;
  recipient: User;
  sender: User;
  createdAt: string;
  updatedAt: Date;
  deletedAt?: Date;
  chatType: { id: number; name: string };
  sticker: { image: { id: string; path: string } };
  unreadCount: number;
  readAt: string;
};

export type Contact = {
  id: string;
  participant: z.infer<typeof ProfileValidation> & {
    id: number;
    photo: { id: string; path: string };
  };
  lastMessage: MessageResponse;
  unreadCount: number;
  isOnline: boolean;
};

const chatApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Messages'],
});

export const chatApi = chatApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getConversationContacts: getConversations(build),
    getConversation: getConversation(build),
    getUserOnlineStatus: getUserOnlineStatus(build),
  }),
  overrideExisting: false,
});

export const {
  useGetConversationContactsQuery,
  useGetConversationQuery,
  useGetUserOnlineStatusQuery,
}: any = chatApi;
