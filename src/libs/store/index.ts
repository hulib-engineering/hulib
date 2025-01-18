import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { api } from '../services/api';
import auth from './authentication';
import menuItem from './menuItem';
import minigame from './minigame';
import storiesReducer from './stories';
import uiState from './uiState';

const reducers = combineReducers({
  menuItem,
  uiState,
  minigame,
  auth,
  api: api.reducer,
  stories: storiesReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
