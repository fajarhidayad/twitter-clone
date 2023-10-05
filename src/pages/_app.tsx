import '@/styles/globals.css';
import '@radix-ui/themes/styles.css';
import type { AppProps, AppType } from 'next/app';
import { trpc } from '@/utils/trpc';
import { Theme } from '@radix-ui/themes';
import RootLayout from '@/layouts/RootLayout';
import store from '@/store';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <Theme accentColor="blue" radius="full">
      <SessionProvider session={session}>
        <Provider store={store}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </Provider>
      </SessionProvider>
    </Theme>
  );
};

export default trpc.withTRPC(App);
