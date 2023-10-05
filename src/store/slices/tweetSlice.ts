import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../reducers';
import type { PayloadAction } from '@reduxjs/toolkit';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/routers/_app';

export type Tweet = inferRouterOutputs<AppRouter>['tweet']['getAll'][0];

type TweetState = {
  tweets: Tweet[];
};

const initialState: TweetState = {
  tweets: [],
};

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    setTweets(state, action: PayloadAction<Tweet[]>) {
      state.tweets = action.payload;
    },
    addTweet(state, action: PayloadAction<Tweet>) {
      state.tweets.unshift(action.payload);
    },
  },
});

export const { setTweets, addTweet } = tweetSlice.actions;
export const getTweets = (state: RootState) => state.tweet.tweets;
export default tweetSlice.reducer;
