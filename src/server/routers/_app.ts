import { router } from '../trpc';
import { tweetRouter } from './tweetRoute';

export const appRouter = router({
  tweet: tweetRouter,
});

export type AppRouter = typeof appRouter;
