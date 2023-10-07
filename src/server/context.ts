import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from './prisma';

export async function createContextInner(
  opts: trpcNext.CreateNextContextOptions
) {
  return {
    prisma,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  return await createContextInner({ req: opts.req, res: opts.res });
}
