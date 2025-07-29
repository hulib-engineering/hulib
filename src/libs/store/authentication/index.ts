import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import type { z } from 'zod';

import type { ProfileValidation } from '@/validations/ProfileValidation';

type SliceState = {
  avatarId: string;
  avatarUrl: string;
  userInfo: z.infer<typeof ProfileValidation> & {
    id: string;
    photo: { id: string; path: string };
    role: { id: number; name: string };
  };
};

const slice = createSlice({
  name: 'auth',
  initialState: { avatarUrl: '', avatarId: '', userInfo: {} } as SliceState,
  reducers: {
    refreshAccessToken: (_state, action) => {
      const accessToken = action.payload;
      localStorage.setItem('access_token', accessToken);
    },
    logout: () => {
      localStorage.clear();
      Cookies.remove('refresh_token');
      Cookies.remove('currentUser');
      Cookies.set('NEXT_LOCALE', 'vi');
      Cookies.remove('defaultLocale');
      Cookies.remove('locales');
      // Sign out and redirect to the login page
      signOut({ callbackUrl: '/auth/login' });
    },
    setAvatarUrl: (state, action) => {
      if (action.payload) {
        const { path, id } = action.payload;
        state.avatarUrl = path ?? '';
        state.avatarId = id ?? '';
      }
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { logout, refreshAccessToken, setAvatarUrl, setUserInfo }
  = slice.actions;

export default slice.reducer;
