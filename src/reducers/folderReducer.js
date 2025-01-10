import { createSlice } from '@reduxjs/toolkit';

const folderSlice = createSlice({
  name: 'folders',
  initialState: {
    value: null,
  },
  reducers: {
    setFolders: (state, action) => {
      state.value = action.payload;
    },
    updateFolders: (state, action) => {
      if (state.value) {
        let copy = state.value;
        copy.splice(
          copy.findIndex((folder) => folder.id === action.payload.id),
          1,
          action.payload
        );
        state.value = copy;
      }
    }
  },
});

export const { setFolders, updateFolders } = folderSlice.actions;
export default folderSlice.reducer;
