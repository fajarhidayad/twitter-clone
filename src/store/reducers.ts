import { combineReducers, createReducer } from '@reduxjs/toolkit';
import tweetReducer from './slices/tweetSlice';

export const rootReducer = combineReducers({
  tweet: tweetReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
