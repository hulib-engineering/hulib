import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import type { z } from 'zod';

import type { ProfileValidation } from '@/validations/ProfileValidation';
import type { StatusEnum } from '@/types/common';

type SliceState = {
  accessToken: string;
  // True once AuthSessionSync has observed a resolved (non-"loading") NextAuth
  // session status at least once — including the logged-out case, where
  // accessToken stays '' forever. Without this flag, prepareHeaders in
  // src/libs/services/api.ts can't tell "not hydrated yet" apart from
  // "hydrated, genuinely anonymous", and would call getSession() on every
  // single request on public/anonymous pages.
  isSessionHydrated: boolean;
  avatarId: string;
  avatarUrl: string;
  userInfo: z.infer<typeof ProfileValidation> & {
    id: string;
    photo: { id: string; path: string };
    role: { id: number; name: string };
    approval: StatusEnum;
  };
};

const slice = createSlice({
  name: 'auth',
  initialState: { accessToken: '', isSessionHydrated: false, avatarUrl: '', avatarId: '', userInfo: {} } as SliceState,
  reducers: {
    // Cache of the NextAuth session's accessToken, kept in sync by AuthSessionSync.
    // RTK Query reads it from here instead of calling next-auth's getSession() on every request.
    setAccessToken: (state, action) => {
      state.accessToken = action.payload ?? '';
      state.isSessionHydrated = true;
    },
    refreshAccessToken: (state, action) => {
      const accessToken = action.payload;
      localStorage.setItem('access_token', accessToken);
      state.accessToken = accessToken ?? '';
      state.isSessionHydrated = true;
    },
    logout: (state) => {
      localStorage.clear();
      Cookies.remove('refresh_token');
      Cookies.remove('currentUser');
      Cookies.set('NEXT_LOCALE', 'vi');
      Cookies.remove('defaultLocale');
      Cookies.remove('locales');
      state.userInfo = {} as SliceState['userInfo'];
      state.avatarUrl = '';
      state.avatarId = '';
      state.accessToken = '';
      state.isSessionHydrated = true;
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

export const { logout, refreshAccessToken, setAccessToken, setAvatarUrl, setUserInfo }
  = slice.actions;

export default slice.reducer;
