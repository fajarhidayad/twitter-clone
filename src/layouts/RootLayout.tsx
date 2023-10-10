import SidebarMenu from '@/components/SidebarMenu';
import { Avatar, Card, Flex, Heading, Text } from '@radix-ui/themes';
import React from 'react';
import ContentLayout from './ContentLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Loading />;

  if (session && router.pathname !== `/settings` && !session.user?.username) {
    router.push(`/settings`);
  }

  return (
    <Flex className="max-w-6xl mx-auto min-h-screen justify-center" px={'5'}>
      <SidebarMenu />
      <ContentLayout>{children}</ContentLayout>
      <TrendMenu />
    </Flex>
  );
};

export default RootLayout;

const TrendMenu = () => {
  return (
    <section className="px-3 w-[300px]">
      <div className="sticky top-5">
        <Card variant="classic" mb={'5'}>
          <Heading size={'5'} mb="5">
            Trends for You
          </Heading>
          <Flex direction={'column'} gap={'5'}>
            <Text weight={'medium'}>React.js</Text>
            <Text weight={'medium'}>Next.js</Text>
            <Text weight={'medium'}>TRPC</Text>
            <Text weight={'medium'}>React-Query</Text>
            <Text weight={'medium'}>Tailwind CSS</Text>
            <Text weight={'medium'}>Radix UI</Text>
          </Flex>
        </Card>
        <Card variant="classic" mb={'3'}>
          <Heading size={'5'} mb="5">
            Recommended following
          </Heading>
          <Flex direction={'column'} gap={'5'}>
            <RecommendedAccount
              img="https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg"
              initial="AW"
              name="Adam Wathan"
              username="adamwathan"
            />
            <RecommendedAccount
              img="https://pbs.twimg.com/profile_images/1545194945161707520/rqkwPViA_400x400.jpg"
              initial="DA"
              name="Dan Abramov"
              username="dan_abramov"
            />
            <RecommendedAccount
              img="https://pbs.twimg.com/profile_images/1666460461884211204/SmBm505D_400x400.jpg"
              initial="MP"
              name="Matt Pocock"
              username="mattpocockuk"
            />
            <RecommendedAccount
              img="https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg"
              initial="S"
              name="shadcn"
              username="shadcn"
            />
          </Flex>
        </Card>

        <footer>
          <Text as="p" size={'1'} color="gray" weight={'medium'}>
            © 2021 Tweety, Inc. All rights reserved.
          </Text>
          <Text as="p" size={'1'} color="gray" weight={'medium'}>
            Created by Fajar Surya Hidayad
          </Text>
        </footer>
      </div>
    </section>
  );
};

const RecommendedAccount = ({
  name,
  username,
  initial,
  img,
}: {
  name: string;
  username: string;
  initial: string;
  img: string;
}) => {
  return (
    <Flex align={'center'} gap={'2'}>
      <Avatar fallback={initial} src={img} />
      <div>
        <Text as="p" weight={'medium'}>
          {name}
        </Text>
        <Text as="p" size={'1'} color="gray" weight={'medium'}>
          @{username}
        </Text>
      </div>
    </Flex>
  );
};
