// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
//
// // import { createWrapper, HYDRATE } from 'next-redux-wrapper';
// import { api } from '@/services/api';
//
// import auth from './authentication';
// import cart from './cart';
// import dish from './dish';
// import dishOption from './dish-option';
// import locale from './locale';
// import state from './menuItem';
// import order from './order';
// import region from './region';
// import relatedDish from './related-dish';
// import subcategory from './subcategory';
// import table from './table';
// import user from './user';
//
// const reducers = combineReducers({
//   // theme,
//   auth,
//   user,
//   order,
//   region,
//   locale,
//   dishOption,
//   relatedDish,
//   cart,
//   state,
//   table,
//   dish,
//   subcategory,
//   api: api.reducer,
// });
//
// const store = configureStore({
//   reducer: reducers,
//   middleware: (getDefaultMiddleware) => {
//     return getDefaultMiddleware().concat(api.middleware);
//   },
// });
//
// setupListeners(store.dispatch);
//
// export { store };
//
// export type IRootState = ReturnType<typeof store.getState>;
// // export const wrapper = createWrapper(store, { debug: true });
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import menuItem from './menuItem';

const reducers = combineReducers({
  menuItem,
});

export const makeStore = () => {
  return configureStore({
    reducer: reducers,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
