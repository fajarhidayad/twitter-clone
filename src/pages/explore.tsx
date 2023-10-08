import { Heading, Text, TextField } from '@radix-ui/themes';
import Head from 'next/head';
import { FaSearch } from 'react-icons/fa';

export default function explore() {
  return (
    <>
      <Head>
        <title>Explore | Tweety</title>
      </Head>

      <section>
        <TextField.Root className="my-6 mx-5">
          <TextField.Slot>
            <FaSearch />
          </TextField.Slot>
          <TextField.Input placeholder="Search Tweety" size={'3'} />
        </TextField.Root>

        <Heading mb={'4'} mx={'4'}>
          Trending
        </Heading>

        <ul className="flex flex-col">
          <li className="hover:bg-gray-100 cursor-pointer px-5 py-3">
            <Text weight={'medium'}>React JS</Text>
          </li>
          <li className="hover:bg-gray-100 cursor-pointer px-5 py-3">
            <Text weight={'medium'}>Next.js</Text>
          </li>
          <li className="hover:bg-gray-100 cursor-pointer px-5 py-3">
            <Text weight={'medium'}>#TRPC</Text>
          </li>
        </ul>
      </section>
    </>
  );
}
