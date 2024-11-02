import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const slice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    refreshAccessToken: (_state, action) => {
      const accessToken = action.payload;
      localStorage.setItem('access_token', accessToken);
    },
    logout: () => {
      localStorage.clear();
      Cookies.remove('refresh_token');
      Cookies.remove('currentUser');
      Cookies.set('NEXT_LOCALE', 'ja');
      Cookies.remove('defaultLocale');
      Cookies.remove('locales');
    },
  },
});

export const { logout, refreshAccessToken } = slice.actions;

export default slice.reducer;
