import type z from 'zod';

import type { ProfileValidation } from '@/validations/ProfileValidation';

import { api } from '../../api';
import type { User } from '../auth';
import getConversation from './getConversation';
import getConversations from './getConversations';

export interface MessageResponse {
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
}

export interface Contact {
  id: string;
  participant: z.infer<typeof ProfileValidation> & {
    id: number;
    photo: { id: string; path: string };
  };
  lastMessage: MessageResponse;
  unreadCount: number;
}

const chatApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Messages'],
});

export const chatApi = chatApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    getConversationContacts: getConversations(build),
    getConversation: getConversation(build),
  }),
  overrideExisting: false,
});

export const { useGetConversationContactsQuery, useGetConversationQuery }: any =
  chatApi;
