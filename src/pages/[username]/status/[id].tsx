import Loading from '@/components/Loading';
import NavProfile from '@/components/NavProfile';
import Reaction from '@/components/Reaction';
import { trpc } from '@/utils/trpc';
import { Avatar, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { formatDateDetails } from '@/utils/formatDate';
import { useSession } from 'next-auth/react';

export default function TweetDetails() {
  const router = useRouter();
  const { id, username } = router.query;
  const { data: session } = useSession();
  const tweet = trpc.tweet.findById.useQuery({
    id: parseInt(id as string),
  });

  if (!tweet.data) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{tweet.data.author.name} Tweet</title>
      </Head>

      <NavProfile title="Post" />

      <section className="px-4 py-3">
        <Flex
          mb={'3'}
          gap={'4'}
          align={'center'}
          width={'max-content'}
          className="cursor-pointer"
          onClick={() => router.push(`/${username}`)}
        >
          <Avatar fallback="U" src={tweet.data.author.image ?? ''} />
          <div>
            <Heading size={'3'} className="hover:underline">
              {tweet.data.author.name}
            </Heading>
            <Text size={'2'} color="gray">
              @{tweet.data.author.username}
            </Text>
          </div>
        </Flex>
        <Text>{tweet.data.text}</Text>
        <Flex mt={'3'}>
          <Text size={'2'} color="gray">
            {formatDateDetails(tweet.data.createdAt)}
          </Text>
        </Flex>
      </section>

      <Separator size={'4'} />
      <Reaction
        likes={tweet.data._count.likes}
        replies={tweet.data._count.replies}
        tweetId={tweet.data.id}
        likedByUser={session && tweet.data.likes[0] ? true : false}
      />
      <Separator size={'4'} />
    </>
  );
}
