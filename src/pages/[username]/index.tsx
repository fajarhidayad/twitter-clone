import NavProfile from '@/components/NavProfile';
import { AppRouter } from '@/server/routers/_app';
import { trpc } from '@/utils/trpc';
import { Button, Flex, Heading, Strong, Text } from '@radix-ui/themes';
import { inferRouterOutputs } from '@trpc/server';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import clsx from 'clsx';
import Loading from '@/components/Loading';
import TweetBox from '@/components/TweetBox';

type User = inferRouterOutputs<AppRouter>['auth']['getUserByUsername'];
type ProfileTab = 'Posts' | 'Replies' | 'Likes';

export default function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>('Posts');
  const router = useRouter();
  const username = router.query.username as string;

  const user = trpc.auth.getUserByUsername.useQuery({
    username,
  });

  return (
    <>
      <Head>
        <title>{username} | Tweety</title>
      </Head>

      <NavProfile title={username} type="profile" />
      <ProfileSection
        user={user.data?.user}
        username={username}
        isFollowing={user.data?.isFollowing}
        redirectSetting={() => router.push(`/settings`)}
      >
        <ProfileTabs tab={tab} setTab={setTab} />
      </ProfileSection>
      {tab === 'Posts' && <PostsSection username={username} />}
      {tab === 'Replies' && <RepliesSection username={username} />}
      {tab === 'Likes' && <LikesSection username={username} />}
    </>
  );
}

const ProfileSection = ({
  redirectSetting,
  user,
  username,
  isFollowing,
  children,
}: {
  user: User['user'] | undefined;
  username: string;
  isFollowing?: User['isFollowing'];
  redirectSetting: () => void;
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();

  return (
    <section className="border-b border-b-gray-300">
      <div className="bg-gray-100 h-[200px]"></div>
      <div className="px-5 py-3 flex flex-col">
        <Flex align={'center'} justify={'end'} className="relative" mb={'5'}>
          <div className="bg-blue-200 rounded-full h-[100px] w-[100px] absolute -top-16 left-0 overflow-hidden">
            {user?.image && (
              <Image
                src={user.image}
                alt="image-profile"
                width={200}
                height={200}
              />
            )}
          </div>
          {user?.username === session?.user.username && (
            <Button className="ml-auto" onClick={redirectSetting}>
              Edit profile
            </Button>
          )}
          {session && user?.username !== session?.user.username && (
            <FollowSection username={username} isFollowing={isFollowing} />
          )}
        </Flex>
        <div className="my-3">
          <Heading>{user?.name ?? 'User not found'}</Heading>
          <Text size={'2'} color="gray">
            @{user?.username ?? username}
          </Text>
        </div>
        <Text size={'3'} mb={'3'}>
          {user && user?.bio}
        </Text>
        {user && (
          <Flex gap={'4'}>
            <Text size={'2'} color="gray">
              <Strong className="text-black">{user._count.following}</Strong>{' '}
              following
            </Text>
            <Text size={'2'} color="gray">
              <Strong className="text-black">{user._count.followers}</Strong>{' '}
              followers
            </Text>
          </Flex>
        )}
      </div>
      {children}
    </section>
  );
};

const FollowSection = ({
  username,
  isFollowing,
}: {
  username: string;
  isFollowing?: User['isFollowing'];
}) => {
  const utils = trpc.useContext();
  const followMut = trpc.auth.followUser.useMutation({
    onSuccess: ({ data }) => {
      utils.auth.getUserByUsername.invalidate({ username });
    },
  });

  const handleFollow = (type: 'follow' | 'unfollow') => {
    followMut.mutateAsync({
      type,
      username,
    });
  };

  if (isFollowing)
    return (
      <Button variant="outline" onClick={() => handleFollow('unfollow')}>
        Unfollow
      </Button>
    );

  return <Button onClick={() => handleFollow('follow')}>Follow</Button>;
};

const ProfileTabs = ({
  tab,
  setTab,
}: {
  tab: ProfileTab;
  setTab: (tab: ProfileTab) => void;
}) => {
  return (
    <Flex align={'center'} justify={'between'} mt={'3'}>
      <TabButton tab="Posts" selectedTab={tab} setTab={setTab} />
      <TabButton tab="Replies" selectedTab={tab} setTab={setTab} />
      <TabButton tab="Likes" selectedTab={tab} setTab={setTab} />
    </Flex>
  );
};

interface TabButtonProps {
  tab: ProfileTab;
  setTab: (tab: ProfileTab) => void;
  selectedTab: ProfileTab;
}

const TabButton = ({ setTab, tab, selectedTab }: TabButtonProps) => {
  const tabClass = clsx('border-b-4 py-3', {
    'border-blue-500': tab === selectedTab,
    'border-transparent': tab !== selectedTab,
  });

  return (
    <button
      className="hover:bg-gray-100 flex-1 py-3"
      onClick={() => setTab(tab)}
    >
      <Text size={'3'} color="gray" className={tabClass}>
        {tab}
      </Text>
    </button>
  );
};

const PostsSection = ({ username }: { username: string }) => {
  const tweets = trpc.tweet.getTweetByAuthor.useQuery({ username });

  if (!tweets.data) return <Loading />;

  return (
    <ul>
      {tweets.data.map((tweet) => (
        <TweetBox key={tweet.id} tweet={tweet} />
      ))}
    </ul>
  );
};

const RepliesSection = ({ username }: { username: string }) => {
  // if (!tweets.data) return <Loading />;

  return (
    <ul>
      <Text>No tweet yet</Text>
    </ul>
  );
};

const LikesSection = ({ username }: { username: string }) => {
  const tweets = trpc.tweet.getLikedTweets.useQuery({ username });

  if (!tweets.data) return <Loading />;

  return (
    <ul>
      {tweets.data.map((tweet) => (
        <TweetBox key={tweet.tweet.id} tweet={tweet.tweet} />
      ))}
    </ul>
  );
};
