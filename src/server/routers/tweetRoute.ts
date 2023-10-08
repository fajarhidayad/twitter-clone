import { TRPCError } from '@trpc/server';
import { router, procedure, isAuthed } from '../trpc';
import { z } from 'zod';

export const tweetRouter = router({
  getAll: procedure.query(async ({ ctx }) => {
    const likes = ctx.session?.user.id
      ? {
          where: {
            authorId: ctx.session.user.id,
          },
        }
      : false;
    const tweets = await ctx.prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
        likes,
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
  getTweetByAuthor: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });
      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      const likes = ctx.session?.user.id
        ? {
            where: {
              authorId: ctx.session.user.id,
            },
          }
        : false;
      const tweets = await ctx.prisma.tweet.findMany({
        where: { authorId: user.id },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              username: true,
            },
          },
          likes,
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
      const tweet = await ctx.prisma.tweet.create({
        data: {
          text: input.text,
          authorId: authorId,
        },
      });

      return tweet;
    }),
  findById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const likes = ctx.session?.user.id
        ? {
            where: {
              authorId: ctx.session.user.id,
            },
          }
        : false;
      const tweet = await ctx.prisma.tweet.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              name: true,
              image: true,
              username: true,
            },
          },
          likes,
          _count: {
            select: {
              likes: true,
              replies: true,
            },
          },
        },
      });

      return tweet;
    }),
  like: procedure
    .use(isAuthed)
    .input(z.object({ tweetId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const tweetId = input.tweetId;

      const like = await ctx.prisma.like.findFirst({
        where: {
          authorId: userId,
          tweetId,
        },
      });

      if (like) {
        await ctx.prisma.like.delete({
          where: {
            id: like.id,
          },
        });
      } else {
        await ctx.prisma.like.create({
          data: {
            authorId: userId,
            tweetId,
          },
        });
      }

      return {
        success: true,
      };
    }),
});
