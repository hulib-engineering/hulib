import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

type StatesProps = {
  isModalOpen?: boolean;
  currentModalRef?: string;
  bottomNavHeight?: number;
  floatingButtonHeight?: number;
};

const slice = createSlice({
  name: 'uiState',

  initialState: {
    currentModalRef: '',
    isModalOpen: false,
    bottomNavHeight: 0,
    floatingButtonHeight: 0,
  } as StatesProps,

  reducers: {
    registerModal: (state, action) => {
      state.currentModalRef = action.payload;
      state.isModalOpen = true;
    },
    unregisterModal: (state, _action) => {
      state.currentModalRef = '';
      state.isModalOpen = false;
    },
    setBottomNavHeight: (state, action: PayloadAction<number>) => {
      state.bottomNavHeight = action.payload;
    },
    setFloatingButtonHeight: (state, action: PayloadAction<number>) => {
      state.floatingButtonHeight = action.payload;
    },
  },
});

export const {
  registerModal,
  unregisterModal,
  setBottomNavHeight,
  setFloatingButtonHeight,
} = slice.actions;
export default slice.reducer;
