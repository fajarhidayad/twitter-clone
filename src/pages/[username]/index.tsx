import NavProfile from '@/components/NavProfile';
import { Button, Flex, Heading, Strong, Text } from '@radix-ui/themes';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const username = router.query.username as string;

  return (
    <>
      <Head>
        <title>{username} | Tweety</title>
      </Head>

      <NavProfile title={username} type="profile" />
      <ProfileSection redirectSetting={() => router.push(`/settings`)} />
    </>
  );
}

const ProfileSection = ({
  redirectSetting,
}: {
  redirectSetting: () => void;
}) => {
  return (
    <section className="border-b border-b-gray-300">
      <div className="bg-gray-100 h-[200px]"></div>
      <div className="px-5 py-3 flex flex-col">
        <Flex align={'center'} justify={'end'} className="relative" mb={'5'}>
          <div className="bg-blue-200 rounded-full h-[100px] w-[100px] absolute -top-16 left-0"></div>
          <Button className="ml-auto" onClick={redirectSetting}>
            Edit profile
          </Button>
        </Flex>
        <div className="mb-3">
          <Heading>John Doe</Heading>
          <Text size={'2'} color="gray">
            @johndoe
          </Text>
        </div>
        <Text size={'3'} mb={'3'}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique,
          corporis.
        </Text>
        <Flex gap={'4'}>
          <Text size={'2'} color="gray">
            <Strong className="text-black">100</Strong> following
          </Text>
          <Text size={'2'} color="gray">
            <Strong className="text-black">100</Strong> followers
          </Text>
        </Flex>
      </div>
    </section>
  );
};
