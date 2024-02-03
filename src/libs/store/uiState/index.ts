import { createSlice } from '@reduxjs/toolkit';

type StatesProps = {
  isModalOpen?: boolean;
  currentModalRef?: string;
};

const slice = createSlice({
  name: 'uiState',
  initialState: { currentModalRef: '', isModalOpen: false } as StatesProps,
  reducers: {
    registerModal: (state, action) => {
      state.currentModalRef = action.payload;
      state.isModalOpen = true;
    },
    unregisterModal: (state, _action) => {
      state.currentModalRef = '';
      state.isModalOpen = false;
    },
  },
});

export const { registerModal, unregisterModal } = slice.actions;

export default slice.reducer;
