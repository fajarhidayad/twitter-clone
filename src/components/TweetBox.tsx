import { AppRouter } from '@/server/routers/_app';
import { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { formatDate } from '@/utils/formatDate';
import Reaction from './Reaction';
import { FaRetweet } from 'react-icons/fa';

type Tweet = inferRouterOutputs<AppRouter>['tweet']['getAll'][0];
type Retweet =
  inferRouterOutputs<AppRouter>['tweet']['getAll'][0]['retweetFrom'];

const TweetBox = ({
  tweet,
  retweetUser,
  retweetUserId,
}: {
  tweet: Tweet;
  retweetUser?: {
    name: string | null;
    username: string | null;
    tweetId: number;
  };
  retweetUserId?: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const toDetailsTweet = () => {
    if (retweetUser) {
      router.push(`/${retweetUser.username}/status/${retweetUser.tweetId}`);
    } else {
      router.push(`/${tweet?.author.username}/status/${tweet?.id}`);
    }
  };

  const handleClickProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${tweet?.author.username}`);
  };

  return (
    <li
      key={tweet?.id}
      onClick={toDetailsTweet}
      className="px-3 pt-3 border-b hover:bg-gray-100 cursor-pointer"
    >
      {retweetUser && (
        <Flex align={'center'} gap={'2'} mb={'2'}>
          <FaRetweet className="text-gray-500" />
          <Text color="gray" size={'2'} weight={'medium'}>
            {retweetUserId === session?.user.id ? 'You' : retweetUser.name}{' '}
            retweeted
          </Text>
        </Flex>
      )}
      <Flex>
        <Avatar
          fallback="U"
          className="z-30"
          src={tweet?.author.image ?? ''}
          onClick={handleClickProfile}
        />
        <div className="ml-3">
          <div className="flex items-center gap-1">
            <Text
              weight={'bold'}
              className="hover:underline"
              onClick={handleClickProfile}
            >
              {tweet?.author.name}
            </Text>
            <Text size={'2'} color="gray">
              @{tweet?.author.username}
            </Text>
            <Text className="text-gray-500">·</Text>
            <Text className="text-gray-500 ml-2" size={'2'}>
              {formatDate(tweet!.createdAt)}
            </Text>
          </div>
          <Text>{tweet!.text}</Text>
        </div>
      </Flex>
      {tweet?.retweetFromId && (
        <Reaction
          likes={
            tweet?.retweetFrom
              ? tweet?.retweetFrom._count.likes
              : tweet?._count.likes
          }
          replies={
            tweet?.retweetFrom
              ? tweet?.retweetFrom._count.replies
              : tweet?._count.replies
          }
          tweetId={tweet?.id}
          retweet={
            tweet?.retweetFrom
              ? tweet?.retweetFrom._count.retweets
              : tweet?._count.retweets
          }
          likedByUser={
            session && tweet?.retweetFrom?.likes[0].authorId ? true : false
          }
          retweetedByUser={
            tweet?.retweetFrom &&
            tweet?.retweetFrom.retweets.length > 0 &&
            tweet?.retweetFrom.retweets[0].authorId === session?.user.id
              ? true
              : false
          }
        />
      )}
      {!tweet?.retweetFromId && (
        <Reaction
          likes={
            tweet?.retweetFrom
              ? tweet?.retweetFrom._count.likes
              : tweet?._count.likes
          }
          replies={
            tweet?.retweetFrom
              ? tweet?.retweetFrom._count.replies
              : tweet?._count.replies
          }
          tweetId={tweet?.id}
          retweet={
            tweet?.retweetFrom
              ? tweet?.retweetFrom._count.retweets
              : tweet?._count.retweets
          }
          likedByUser={session && tweet?.likes[0] ? true : false}
          retweetedByUser={
            tweet?.retweets.length > 0 &&
            tweet?.retweets[0].authorId === session?.user.id
          }
        />
      )}
    </li>
  );
};

export default TweetBox;
