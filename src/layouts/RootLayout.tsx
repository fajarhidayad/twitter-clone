import SidebarMenu from '@/components/SidebarMenu';
import { Flex } from '@radix-ui/themes';
import React from 'react';
import ContentLayout from './ContentLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex className="max-w-6xl mx-auto min-h-screen justify-center" px={'5'}>
      <SidebarMenu />
      <ContentLayout>{children}</ContentLayout>
    </Flex>
  );
}
