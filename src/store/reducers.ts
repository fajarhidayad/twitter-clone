import { combineReducers } from '@reduxjs/toolkit';
import tweetReducer from './slices/tweetSlice';
import authReducer from './slices/authSlice';

export const rootReducer = combineReducers({
  tweet: tweetReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
