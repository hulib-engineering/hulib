import { createSlice } from '@reduxjs/toolkit';

export interface StoriesState {
  stories: any[];
}

const initialState: StoriesState = {
  stories: [],
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload;
    },
  },
});

const storiesReducer = storiesSlice.reducer;

export default storiesReducer;
