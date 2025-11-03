import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { MessageResponse } from '@/libs/services/modules/chat';

export type Message = {
  id: string;
  from: string;
  to: string;
  content: string;
  direction: 'sent' | 'received';
  timestamp: string;
};
type ChatWindow = {
  id: string;
  name: string;
  avatarUrl?: string;
  isOpen: boolean;
  isMinimized: boolean;
  unread?: number;
  messages?: Message[];
  lastMessage?: MessageResponse;
};
type ChatState = {
  chats: ChatWindow[];
  currentChatDetail: Pick<ChatWindow, 'id' | 'name' | 'avatarUrl'> | null;
};

const initialState: ChatState = {
  chats: [],
  currentChatDetail: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat: (state, action: PayloadAction<Omit<ChatWindow, 'messages'>>) => {
      const existing = state.chats.find(c => c.id === action.payload.id);
      if (existing) {
        existing.isOpen = true;
        existing.isMinimized = false;
      } else {
        // Limit open chats to 3
        const openingChats = state.chats.filter(
          c => c.isOpen && !c.isMinimized,
        );
        if (openingChats.length >= 3) {
          // Minimize the oldest open chat
          if (openingChats[0]) {
            openingChats[0].isMinimized = true;
          }
        }

        state.chats.push({
          ...action.payload,
          isOpen: true,
          isMinimized: false,
          messages: [],
        });
      }
    },
    closeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
    },
    minimizeChat: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.isMinimized = true;
      }
    },
    restoreChat: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.isOpen = true;
        chat.isMinimized = false;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.unread = 0;
      }
    },
    openChatDetail: (
      state,
      action: PayloadAction<Pick<ChatWindow, 'id' | 'name' | 'avatarUrl'>>,
    ) => {
      state.currentChatDetail = action.payload;
    },
  },
});

export const {
  openChat,
  closeChat,
  minimizeChat,
  restoreChat,
  // addMessage,
  markAsRead,
  openChatDetail,
} = chatSlice.actions;

export default chatSlice.reducer;
