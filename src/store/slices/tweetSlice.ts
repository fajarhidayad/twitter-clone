import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../reducers';
import type { PayloadAction } from '@reduxjs/toolkit';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '@/server/routers/_app';

export type Tweet = inferRouterOutputs<AppRouter>['tweet']['getAll'][0];

type TweetState = {
  tweets: Tweet[];
  tweet: Tweet | undefined;
};

const initialState: TweetState = {
  tweets: [],
  tweet: undefined,
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
    setTweet(state, action: PayloadAction<Tweet>) {
      state.tweet = action.payload;
    },
  },
});

export const { setTweets, addTweet, setTweet } = tweetSlice.actions;
export const getTweets = (state: RootState) => state.tweet.tweets;
export const getTweetById = (state: RootState) => state.tweet.tweet;
export default tweetSlice.reducer;
