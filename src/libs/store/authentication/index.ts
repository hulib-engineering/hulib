import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const slice = createSlice({
  name: 'auth',
  initialState: { avatarUrl: '', avatarId: '' },
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
    },
    setAvatarUrl: (state, action) => {
      const { path, id } = action.payload;
      state.avatarUrl = path ?? '';
      state.avatarId = id ?? '';
    },
  },
});

export const { logout, refreshAccessToken, setAvatarUrl } = slice.actions;

export default slice.reducer;
