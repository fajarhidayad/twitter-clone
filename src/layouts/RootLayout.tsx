import SidebarMenu from '@/components/SidebarMenu';
import { Flex } from '@radix-ui/themes';
import React from 'react';
import ContentLayout from './ContentLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Loading />;

  if (session && router.pathname !== `/settings` && !session.user?.username) {
    router.push(`/settings`);
  }

  return (
    <Flex className="max-w-6xl mx-auto min-h-screen justify-center" px={'5'}>
      <SidebarMenu />
      <ContentLayout>{children}</ContentLayout>
    </Flex>
  );
}
