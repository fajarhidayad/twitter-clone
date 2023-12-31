import { isAuthed, procedure, router } from '@/server/trpc';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { profileSchema } from '@/schema/profileSchema';

export const authRouter = router({
  getUserById: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return user;
    }),
  getUserByEmail: procedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      return user;
    }),
  getUserByUsername: procedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        include: {
          _count: {
            select: { followers: true, following: true },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const isFollowing = ctx.session
        ? await ctx.prisma.follow.findFirst({
            where: { followerId: user.id, followingId: ctx.session.user.id },
          })
        : false;

      return { user, isFollowing };
    }),
  signUp: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUsername = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (existingUsername) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already exists',
        });
      }
      const existingEmail = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (existingEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const createUser = await ctx.prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          name: input.name,
        },
      });
      await ctx.prisma.userPassword.create({
        data: {
          password: hashedPassword,
          userId: createUser.id,
        },
      });

      return {
        status: 'success',
        data: createUser,
      };
    }),
  signIn: procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      const password = await ctx.prisma.userPassword.findFirst({
        where: { userId: user.id },
      });

      if (!password)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            'Credentials found using another provider, try sign in using another provider.',
        });

      if (bcrypt.compareSync(input.password, password.password)) {
        return {
          status: 'success',
          data: user,
        };
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Incorrect password',
        });
      }
    }),
  updateProfile: procedure
    .use(isAuthed)
    .input(z.object({ profile: profileSchema }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      const checkUsername = await ctx.prisma.user.findFirst({
        where: { username: input.profile.username },
      });

      if (checkUsername && checkUsername.id !== userId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already exists',
        });

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          ...input.profile,
        },
      });

      return {
        status: 'success',
        data: updatedUser,
      };
    }),
  followUser: procedure
    .use(isAuthed)
    .input(
      z.object({
        username: z.string(),
        type: z.enum(['follow', 'unfollow']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const author = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });

      if (!author)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      if (input.type === 'unfollow') {
        const unfollow = await ctx.prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId: author.id,
              followingId: userId,
            },
          },
        });
        return {
          status: 'success',
          data: unfollow,
        };
      } else {
        const check = await ctx.prisma.follow.findFirst({
          where: { followerId: author.id, followingId: userId },
        });
        if (check)
          return {
            status: 'failed',
            message: 'You already follow this user',
          };

        const follow = await ctx.prisma.follow.create({
          data: {
            followerId: author.id,
            followingId: userId,
          },
        });

        return {
          status: 'success',
          data: follow,
        };
      }
    }),
});
