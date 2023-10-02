import { prisma } from '../prisma';
import { router, procedure } from '../trpc';
import { z } from 'zod';

export const tweetRouter = router({
  getAll: procedure.query(async () => {
    const tweets = await prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return tweets;
  }),
  create: procedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const tweet = await prisma.tweet.create({
        data: {
          text: input.text,
        },
      });

      return tweet;
    }),
  findById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const tweet = await prisma.tweet.findUnique({
        where: { id: input.id },
      });

      return tweet;
    }),
});
