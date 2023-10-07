import { prisma } from '../prisma';
import { router, procedure, isAuthed } from '../trpc';
import { z } from 'zod';

export const tweetRouter = router({
  getAll: procedure.query(async () => {
    const tweets = await prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    return tweets;
  }),
  create: procedure
    .use(isAuthed)
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const authorId = ctx.session.user.id;
      const tweet = await prisma.tweet.create({
        data: {
          text: input.text,
          authorId: authorId,
        },
      });

      return tweet;
    }),
  findById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const tweet = await prisma.tweet.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              username: true,
            },
          },
        },
      });

      return tweet;
    }),
  // like: procedure
  //   .input(z.object({ tweetId: z.number() }))
  //   .mutation(async ({ input, ctx }) => {

  //   }),
});
