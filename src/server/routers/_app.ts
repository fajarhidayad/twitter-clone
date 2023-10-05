import { router } from '../trpc';
import { authRouter } from './authRoute';
import { tweetRouter } from './tweetRoute';

export const appRouter = router({
  tweet: tweetRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
