import NextAuth from 'next-auth/next';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';
import { User } from '@prisma/client';
import { prisma } from '@/server/prisma';

const client = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: process.env.NEXTAUTH_URL + '/api/trpc',
      headers() {
        return {
          pass: `${process.env.NEXTAUTH_SECRET}`,
        };
      },
    }),
  ],
});

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@mail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials');
        }

        const user = await client.auth.signIn.mutate({ ...credentials });
        if (user.status === 'success') {
          return user.data;
        } else {
          throw new Error(user.status);
        }
      },
    }),
  ],
  callbacks: {
    // async signIn(p) {
    //   try {
    //     return true;
    //   } catch (error) {
    //     throw new Error('User not found');
    //   }
    // },
    // @ts-ignore
    async jwt(p) {
      if (p.trigger === 'update' && p.session.user.username) {
        return {
          ...p.token,
          user: p.session.user,
        };
      }

      if (p.user) {
        return {
          ...p.token,
          user: p.user,
        };
      }
      return p.token;
    },
    async session(p) {
      return {
        ...p.session,
        user: p.token.user,
      };
    },
  },
  jwt: {
    secret: `${process.env.JWT_SECRET}`,
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
});
