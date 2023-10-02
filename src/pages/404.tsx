import { Heading } from '@radix-ui/themes';
import Head from 'next/head';
import React from 'react';

export default function NotFoundPage() {
  return (
    <main className="mx-auto">
      <Head>
        <title>User Not Found</title>
      </Head>
      <Heading>User Not Found</Heading>
    </main>
  );
}
