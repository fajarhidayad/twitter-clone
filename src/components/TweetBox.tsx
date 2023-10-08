import { AppRouter } from '@/server/routers/_app';
import { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Avatar, Flex, Text } from '@radix-ui/themes';
import { formatDate } from '@/utils/formatDate';
import Reaction from './Reaction';

type Tweet = inferRouterOutputs<AppRouter>['tweet']['getAll'][0];

const TweetBox = ({ tweet }: { tweet: Tweet }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const toDetailsTweet = () => {
    router.push(`/${tweet.author.username}/status/${tweet.id}`);
  };

  const handleClickProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/${tweet.author.username}`);
  };

  return (
    <li
      key={tweet.id}
      onClick={toDetailsTweet}
      className="px-3 pt-3 border-b hover:bg-gray-100 cursor-pointer"
    >
      <Flex>
        <Avatar
          fallback="U"
          className="z-30"
          src={tweet.author.image ?? ''}
          onClick={handleClickProfile}
        />
        <div className="ml-3">
          <div className="flex items-center gap-1">
            <Text
              weight={'bold'}
              className="hover:underline"
              onClick={handleClickProfile}
            >
              {tweet.author.name}
            </Text>
            <Text size={'2'} color="gray">
              @{tweet.author.username}
            </Text>
            <Text className="text-gray-500">·</Text>
            <Text className="text-gray-500 ml-2" size={'2'}>
              {formatDate(tweet.createdAt)}
            </Text>
          </div>
          <Text>{tweet.text}</Text>
        </div>
      </Flex>
      <Reaction
        likes={tweet._count.likes}
        replies={tweet._count.replies}
        tweetId={tweet.id}
        likedByUser={session && tweet.likes[0] ? true : false}
      />
    </li>
  );
};

export default TweetBox;
