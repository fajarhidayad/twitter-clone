import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function createContextInner(
  opts: trpcNext.CreateNextContextOptions
) {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  return {
    prisma,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return await createContextInner({ req: opts.req, res: opts.res });
}
