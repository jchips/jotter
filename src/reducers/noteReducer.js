import { createSlice } from '@reduxjs/toolkit';

const noteSlice = createSlice({
  name: 'notes',
  initialState: {
    value: null,
  },
  reducers: {
    setNotes: (state, action) => {
      state.value = action.payload;
    },
    updateNotes: (state, action) => {
      if (state.value) {
        let copy = state.value;
        copy.splice(
          copy.findIndex((note) => note.id === action.payload.id),
          1,
          action.payload
        );
        state.value = copy;
      }
    }
  },
});

export const { setNotes, updateNotes } = noteSlice.actions;
export default noteSlice.reducer;
