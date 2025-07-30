import { createSlice } from '@reduxjs/toolkit';

type StatesProps = {
  items?: string[];
};

const slice = createSlice({
  name: 'menuItem',
  initialState: { items: [] } as StatesProps,
  reducers: {
    registerChild: (state, action) => {
      if (!state.items?.includes(action.payload.child)) {
        const currentChildren = state?.items || [];
        state.items = [...currentChildren, action.payload.child];
      }
    },
    unregisterChild: (state, action) => {
      state.items?.filter(item => item !== action.payload.child);
    },
  },
});

export const { registerChild, unregisterChild } = slice.actions;

export default slice.reducer;
