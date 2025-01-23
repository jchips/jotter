import { createSlice } from '@reduxjs/toolkit';

const uConfigSlice = createSlice({
  name: 'configs',
  initialState: {
    value: null,
  },
  reducers: {
    setConfigs: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setConfigs } = uConfigSlice.actions;
export default uConfigSlice.reducer;
