import Loading from '@/components/Loading';
import NavProfile from '@/components/NavProfile';
import Reaction from '@/components/Reaction';
import { trpc } from '@/utils/trpc';
import { Avatar, Flex, Heading, Separator, Text } from '@radix-ui/themes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { formatDateDetails } from '@/utils/formatDate';
import { useSession } from 'next-auth/react';
import { FaRetweet } from 'react-icons/fa';

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

  const directToProfile = () => {
    router.push(`/${username}`);
  };

  return (
    <>
      <Head>
        <title>{tweet.data.author.name} Tweet</title>
      </Head>

      <NavProfile title="Post" />

      <section className="px-4 py-3">
        {tweet.data.retweetFromId && (
          <Flex align={'center'} gap={'2'} mb={'2'}>
            <FaRetweet className="text-gray-500" />
            <Text color="gray" size={'2'} weight={'medium'}>
              {tweet.data.authorId === session?.user.id
                ? 'You '
                : tweet.data.author.name}{' '}
              retweeted
            </Text>
          </Flex>
        )}
        {tweet.data.retweetFrom ? (
          <TweetDetailsBox
            directToProfile={directToProfile}
            text={tweet.data.retweetFrom.text!}
            {...tweet.data.retweetFrom.author}
          />
        ) : (
          <TweetDetailsBox
            directToProfile={directToProfile}
            text={tweet.data.text!}
            {...tweet.data.author}
          />
        )}
        <Flex mt={'3'}>
          <Text size={'2'} color="gray">
            {formatDateDetails(tweet.data.createdAt)}
          </Text>
        </Flex>
      </section>

      <Separator size={'4'} />
      <Reaction
        likes={
          tweet.data.retweetFrom
            ? tweet.data.retweetFrom._count.likes
            : tweet.data._count.likes
        }
        replies={
          tweet.data.retweetFrom
            ? tweet.data.retweetFrom._count.replies
            : tweet.data._count.replies
        }
        tweetId={tweet.data.id}
        likedByUser={session && tweet.data.likes[0] ? true : false}
        retweet={
          tweet.data.retweetFrom
            ? tweet.data.retweetFrom._count.retweets
            : tweet.data._count.retweets
        }
        retweetedByUser={
          tweet.data.authorId === session?.user.id ? true : false
        }
      />
      <Separator size={'4'} />
    </>
  );
}

const TweetDetailsBox = (props: {
  directToProfile: () => void;
  image: string | null;
  name: string | null;
  username: string | null;
  text: string | null;
}) => {
  return (
    <>
      <Flex
        mb={'3'}
        gap={'4'}
        align={'center'}
        width={'max-content'}
        className="cursor-pointer"
        onClick={props.directToProfile}
      >
        <Avatar fallback="U" src={props.image ?? ''} />
        <div>
          <Heading size={'3'} className="hover:underline">
            {props.name}
          </Heading>
          <Text size={'2'} color="gray">
            @{props.username}
          </Text>
        </div>
      </Flex>
      <Text>{props.text}</Text>
    </>
  );
};
