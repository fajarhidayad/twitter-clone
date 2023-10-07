import '@/styles/globals.css';
import '@radix-ui/themes/styles.css';
import type { AppProps, AppType } from 'next/app';
import { trpc } from '@/utils/trpc';
import { Theme } from '@radix-ui/themes';
import RootLayout from '@/layouts/RootLayout';
import { SessionProvider } from 'next-auth/react';

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <Theme accentColor="blue" radius="full">
      <SessionProvider session={session}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </SessionProvider>
    </Theme>
  );
};

export default trpc.withTRPC(App);
