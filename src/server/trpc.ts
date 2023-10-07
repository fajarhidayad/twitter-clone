import { TRPCError, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

export const isAuthed = middleware(async (opts) => {
  const { ctx } = opts;

  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    });
  }

  return opts.next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});
