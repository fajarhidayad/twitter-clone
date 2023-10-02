import '@/styles/globals.css';
import '@radix-ui/themes/styles.css';
import type { AppProps, AppType } from 'next/app';
import { trpc } from '@/utils/trpc';
import { Theme } from '@radix-ui/themes';
import RootLayout from '@/layouts/RootLayout';
import store from '@/store';
import { Provider } from 'react-redux';

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <Theme accentColor="blue" radius="full">
      <Provider store={store}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </Provider>
    </Theme>
  );
};

export default trpc.withTRPC(App);
