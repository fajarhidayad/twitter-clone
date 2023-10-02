import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addTweet, getTweets, setTweets } from '@/store/slices/tweetSlice';
import { formatDate } from '@/utils/formatDate';
import { trpc } from '@/utils/trpc';
import { Tweet } from '@prisma/client';
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Separator,
  Text,
  TextArea,
} from '@radix-ui/themes';
import Head from 'next/head';
import { useEffect, useState } from 'react';

type Tab = 'for-you' | 'following';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('for-you');

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
  }

  return (
    <>
      <Head>
        <title>Tweety</title>
      </Head>
      <Nav activeTab={activeTab} handleTabChange={handleTabChange} />
      <TweetInput />
      <section>
        {activeTab === 'for-you' && <TabContent />}
        {activeTab === 'following' && <TabContent />}
      </section>
    </>
  );
}

const Nav = (props: {
  handleTabChange: (input: Tab) => void;
  activeTab: Tab;
}) => {
  return (
    <nav className="px-5 py-3 border-b sticky top-0 backdrop-blur z-50">
      <Heading mb={'5'}>Home</Heading>
      <Flex direction={'row'} justify={'between'}>
        <Button
          variant="ghost"
          radius="none"
          color="gray"
          className="flex-1 group"
          onClick={() => props.handleTabChange('for-you')}
        >
          <Text
            className={
              `text-slate-800 border-b-2 group-hover:border-b-blue-500 py-2 ` +
              (props.activeTab === 'for-you'
                ? 'border-b-blue-500'
                : 'border-b-transparent')
            }
          >
            For You
          </Text>
        </Button>
        <Separator size={'2'} orientation="vertical" mx={'2'} />
        <Button
          variant={'ghost'}
          radius="none"
          color="gray"
          className="flex-1 group"
          onClick={() => props.handleTabChange('following')}
        >
          <Text
            className={
              `text-slate-800 border-b-2 group-hover:border-b-blue-500 py-2 ` +
              (props.activeTab === 'following'
                ? 'border-b-blue-500'
                : 'border-b-transparent')
            }
          >
            Following
          </Text>
        </Button>
      </Flex>
    </nav>
  );
};

const TweetInput = () => {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const createTweet = trpc.tweet.create.useMutation({
    async onSuccess(tweet) {
      setText('');
      dispatch(addTweet(tweet));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length === 0) return;

    try {
      await createTweet.mutateAsync({ text });
    } catch (error) {
      console.error({ error }, 'Failed to add tweet');
    }
  };

  return (
    <div className="border-b px-5 py-3">
      <form onSubmit={handleSubmit}>
        <Flex gap={'3'} mb={'2'}>
          <Avatar fallback="U" radius="full" variant="solid" color="gray" />
          <TextArea
            size={'3'}
            placeholder="What's on your mind?"
            variant="surface"
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Flex>
        <Flex justify={'end'}>
          <Button type="submit" size={'3'}>
            Post
          </Button>
        </Flex>
      </form>
    </div>
  );
};

const TabContent = () => {
  const tweets = useAppSelector(getTweets);
  const tweetQuery = trpc.tweet.getAll.useQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tweetQuery.data) {
      dispatch(setTweets(tweetQuery.data));
    }
  }, [tweetQuery.data, dispatch]);

  return (
    <div className="py-3">
      <ul>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </ul>
    </div>
  );
};

const Tweet = ({ tweet }: { tweet: Tweet }) => {
  return (
    <li key={tweet.id} className="p-3 border-b flex">
      <Avatar fallback="U" variant="solid" color="gray" />
      <div className="ml-3">
        <div className="flex items-center gap-1">
          <Text weight={'bold'}>User</Text>
          <Text size={'2'} color="gray">
            @user
          </Text>
          <Text className="text-gray-500">·</Text>
          <Text className="text-gray-500 ml-2" size={'2'}>
            {formatDate(tweet.createdAt)}
          </Text>
        </div>
        <Text>{tweet.text}</Text>
      </div>
    </li>
  );
};
