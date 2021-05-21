import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const library = createSlice({
  name: 'library',
  initialState: {},
  reducers: {
    addToLibrary: (state, action: PayloadAction<any>) => {
      state = action.payload;
    },
  },
});

export default library.reducer;
