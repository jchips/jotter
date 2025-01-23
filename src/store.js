import { configureStore } from '@reduxjs/toolkit'
import noteReducer from '@/reducers/noteReducer';
import folderReducer from '@/reducers/folderReducer';
import configReducer from '@/reducers/configReducer';

export default configureStore({
  reducer: {
    notes: noteReducer,
    folders: folderReducer,
    configs: configReducer,
  },
});