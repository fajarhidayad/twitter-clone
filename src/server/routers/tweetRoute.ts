import { TRPCError } from '@trpc/server';
import { router, procedure, isAuthed } from '../trpc';
import { z } from 'zod';

const includeTweetProp = (
  likes:
    | false
    | {
        where: {
          authorId: string;
        };
      }
) => ({
  author: {
    select: {
      name: true,
      image: true,
      username: true,
    },
  },
  likes,
  retweetFrom: {
    include: {
      likes,
      retweets: likes,
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
          retweets: true,
        },
      },
    },
  },
  retweets: likes,
  _count: {
    select: {
      likes: true,
      replies: true,
      retweets: true,
    },
  },
});

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
        ...includeTweetProp(likes),
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
        orderBy: { createdAt: 'desc' },
        where: { authorId: user.id },
        include: includeTweetProp(likes),
      });

      return tweets;
    }),
  getLikedTweets: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
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

      const likedTweets = await ctx.prisma.like.findMany({
        orderBy: { createdAt: 'desc' },
        where: { authorId: user.id },
        select: {
          tweet: {
            include: includeTweetProp(likes),
          },
        },
      });

      return likedTweets;
    }),
  getFollowingTweets: procedure.use(isAuthed).query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const following = await ctx.prisma.follow.findMany({
      where: {
        followingId: userId,
      },
    });
    const likes = ctx.session?.user.id
      ? {
          where: {
            authorId: ctx.session.user.id,
          },
        }
      : false;

    const tweets = await ctx.prisma.tweet.findMany({
      orderBy: { createdAt: 'desc' },
      where: {
        authorId: {
          in: following.map((follow) => follow.followerId),
        },
      },
      include: includeTweetProp(likes),
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
        include: includeTweetProp(likes),
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
  retweet: procedure
    .use(isAuthed)
    .input(
      z.object({ tweetId: z.number(), text: z.string().max(255).nullish() })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const tweetId = input.tweetId;

      const retweet = await ctx.prisma.tweet.findFirst({
        where: {
          retweetFromId: tweetId,
          authorId: userId,
        },
      });

      if (retweet) {
        await ctx.prisma.tweet.delete({
          where: {
            id: retweet.id,
          },
        });

        return {
          status: 'success',
        };
      } else {
        await ctx.prisma.tweet.create({
          data: {
            authorId: userId,
            retweetFromId: tweetId,
            text: input.text,
          },
        });
        return {
          status: 'success',
        };
      }
    }),
});
