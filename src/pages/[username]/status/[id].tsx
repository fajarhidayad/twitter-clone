import Loading from '@/components/Loading';
import NavProfile from '@/components/NavProfile';
import Reaction from '@/components/Reaction';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getTweetById, setTweet } from '@/store/slices/tweetSlice';
import { trpc } from '@/utils/trpc';
import { Avatar, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { formatDateDetails } from '@/utils/formatDate';

export default function TweetDetails() {
  const router = useRouter();
  const { id, username } = router.query;
  const tweet = useAppSelector(getTweetById);
  const dispatch = useAppDispatch();

  const tweetQuery = trpc.tweet.findById.useQuery({
    id: parseInt(id as string),
  });

  useEffect(() => {
    if (tweetQuery.data) {
      dispatch(setTweet(tweetQuery.data));
    }
  }, [tweetQuery.data, dispatch]);

  if (!tweet || tweetQuery.status === 'loading') {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>{tweet.author.name} Tweet</title>
      </Head>

      <NavProfile title="Post" />

      <section className="px-4 py-3">
        <Flex
          mb={'3'}
          gap={'4'}
          align={'center'}
          onClick={() => router.push(`/${username}`)}
        >
          <Avatar fallback="U" src={tweet.author.image ?? ''} />
          <div>
            <Heading size={'3'}>{tweet.author.name}</Heading>
            <Text size={'2'} color="gray">
              @{tweet.author.username}
            </Text>
          </div>
        </Flex>
        <Text>{tweet.text}</Text>
        <Flex mt={'3'}>
          <Text size={'2'} color="gray">
            {formatDateDetails(tweet.createdAt)}
          </Text>
        </Flex>
      </section>

      <Separator size={'4'} />
      <Reaction />
      <Separator size={'4'} />
    </>
  );
}