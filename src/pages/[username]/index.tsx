import NavProfile from '@/components/NavProfile';
import { AppRouter } from '@/server/routers/_app';
import { trpc } from '@/utils/trpc';
import { Button, Flex, Heading, Strong, Text } from '@radix-ui/themes';
import { inferRouterOutputs } from '@trpc/server';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

type User = inferRouterOutputs<AppRouter>['auth']['getUserByUsername'];

export default function ProfilePage() {
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
      />
    </>
  );
}

const ProfileSection = ({
  redirectSetting,
  user,
  username,
  isFollowing,
}: {
  user: User['user'] | undefined;
  username: string;
  isFollowing?: User['isFollowing'];
  redirectSetting: () => void;
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
      utils.auth.getUserByUsername.invalidate({ username: username });
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
