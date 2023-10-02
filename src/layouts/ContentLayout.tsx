import { Heading, Tabs, Text } from '@radix-ui/themes';
import React from 'react';

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="border-x border-x-gray-300 min-h-[200vh] flex-grow max-w-xl flex-1">
      {children}
    </main>
  );
}
