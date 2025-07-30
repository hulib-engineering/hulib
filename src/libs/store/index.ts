import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { api } from '../services/api';
import auth from './authentication';
import menuItem from './menuItem';
import messenger from './messenger';
import minigame from './minigame';
import stories from './stories';
import uiState from './uiState';

const reducers = combineReducers({
  menuItem,
  uiState,
  minigame,
  auth,
  stories,
  messenger,
  api: api.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(api.middleware),
  });

  // ✅ Enable automatic refetch on focus or reconnect
  setupListeners(store.dispatch);

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
