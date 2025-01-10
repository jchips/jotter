import { configureStore } from '@reduxjs/toolkit'
import noteReducer from '@/reducers/noteReducer';
import folderReducer from '@/reducers/folderReducer'

export default configureStore({
  reducer: {
    notes: noteReducer,
    folders: folderReducer
  },
});