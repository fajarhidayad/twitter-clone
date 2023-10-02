import { Button, Flex, Heading, Section, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';

export default function SidebarMenu() {
  return (
    <aside className="w-[200px]">
      <Section pt={'3'} className="fixed top-0">
        <Link href={'/'}>
          <Heading mb={'5'}>Tweety</Heading>
        </Link>

        <Flex direction={'column'} align={'start'} gap={'4'}>
          <Link href={'/'} className="px-4 py-2 rounded-full hover:bg-gray-100">
            <Text>Home</Text>
          </Link>
          <Link
            href={'/explore'}
            className="px-4 py-2 rounded-full hover:bg-gray-100"
          >
            <Text>Explore</Text>
          </Link>
          <Link
            href={'/profile'}
            className="px-4 py-2 rounded-full hover:bg-gray-100"
          >
            <Text>Profile</Text>
          </Link>
          <Button size={'3'}>Sign In</Button>
        </Flex>
      </Section>
    </aside>
  );
}
