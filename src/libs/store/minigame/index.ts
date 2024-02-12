import { createSlice } from '@reduxjs/toolkit';

type StatesProps = {
  numOfAvailableMovements: number;
  guessedIds: string[];
};

const slice = createSlice({
  name: 'minigame',
  initialState: {
    numOfAvailableMovements: 0,
    guessedIds: [],
  } as StatesProps,
  reducers: {
    initMinigame: (state) => {
      state.numOfAvailableMovements = 0;
      state.guessedIds = [];
    },
    handleMovement: (state) => {
      state.numOfAvailableMovements += 1;
    },
    handleGuess: (state, action) => {
      state.guessedIds.push(action.payload);
    },
  },
});

export const { initMinigame, handleMovement, handleGuess } = slice.actions;

export default slice.reducer;
