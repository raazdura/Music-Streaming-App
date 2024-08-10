import { configureStore } from '@reduxjs/toolkit';

import { musicCoreApi } from './services/musicCore';
import playerReducer from './features/playerSlice';
import userReducer from './features/userSlice'

export const store = configureStore({
  reducer: {
    [musicCoreApi.reducerPath]: musicCoreApi.reducer,
    player: playerReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(musicCoreApi.middleware),
});