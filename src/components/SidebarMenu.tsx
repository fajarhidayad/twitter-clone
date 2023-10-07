import {
  Avatar,
  Button,
  Flex,
  Heading,
  Section,
  Text,
  Dialog,
  Separator,
  TextField,
  Tabs,
} from '@radix-ui/themes';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function SidebarMenu() {
  const { data: session, status } = useSession();
  return (
    <aside className="w-[200px]">
      <Section pt={'3'} className="fixed top-0 h-full w-[200px]">
        <Link href={'/'}>
          <Heading mb={'5'}>Tweety</Heading>
        </Link>

        <Flex
          direction={'column'}
          align={'start'}
          gap={'4'}
          height={'100%'}
          width={'100%'}
        >
          <Link href={'/'} className="px-4 py-2 rounded-full hover:bg-gray-100">
            <Text>Home</Text>
          </Link>
          <Link
            href={'/explore'}
            className="px-4 py-2 rounded-full hover:bg-gray-100"
          >
            <Text>Explore</Text>
          </Link>
          {status === 'authenticated' && (
            <Link
              href={`/${session?.user?.username}`}
              className="px-4 py-2 rounded-full hover:bg-gray-100"
            >
              <Text>Profile</Text>
            </Link>
          )}
          {status === 'unauthenticated' && <DialogForm />}
          {status === 'authenticated' && (
            <Button
              variant="ghost"
              color="red"
              size={'3'}
              ml={'4'}
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          )}

          {status === 'authenticated' && (
            <Flex className="mt-auto w-full" align={'center'} gap={'2'}>
              <Avatar fallback="U" src={session.user?.image ?? ''} />
              <Flex direction={'column'} align={'start'} gap={'2'}>
                <Text weight={'medium'} mb={'-2'}>
                  {session.user?.name}
                </Text>
                <Text size={'2'} color="gray">
                  @{session.user.username}
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Section>
    </aside>
  );
}

const DialogForm = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size={'3'}>Sign in</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Tabs.Root defaultValue="signin" className="flex flex-col items-center">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
            <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="signin" className="w-full">
            <SignInForm />
          </Tabs.Content>
          <Tabs.Content value="signup" className="w-full">
            <SignUpForm />
          </Tabs.Content>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const SignInForm = () => {
  return (
    <Flex
      direction={'column'}
      align={'center'}
      className="max-w-[300px] mx-auto"
    >
      <Button
        size={'4'}
        className="w-full"
        onClick={() => signIn('google', { redirect: true })}
      >
        <Text size={'6'}>
          <FcGoogle />
        </Text>
        Sign in with Google
      </Button>
      <Separator orientation="horizontal" size={'4'} color="blue" my={'5'} />
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Flex direction={'column'} align={'center'} gap={'4'}>
          <TextField.Root className="w-full">
            <TextField.Input placeholder="Username" size={'3'} />
          </TextField.Root>
          <TextField.Root className="w-full">
            <TextField.Input
              placeholder="Password"
              type="password"
              size={'3'}
            />
          </TextField.Root>
          <Flex gap={'4'} justify={'center'} align={'center'}>
            <Dialog.Close>
              <Button size={'2'} className="w-full" variant="ghost">
                Cancel
              </Button>
            </Dialog.Close>
            <Button size={'2'} className="w-full">
              Sign In
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

const SignUpForm = () => {
  return (
    <Flex
      direction={'column'}
      align={'center'}
      className="max-w-[300px] mx-auto"
    >
      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Flex direction={'column'} align={'center'} gap={'4'}>
          <TextField.Root className="w-full">
            <TextField.Input placeholder="Name" size={'3'} />
          </TextField.Root>
          <TextField.Root className="w-full">
            <TextField.Input placeholder="Email" size={'3'} />
          </TextField.Root>
          <TextField.Root className="w-full">
            <TextField.Input placeholder="Username" size={'3'} />
          </TextField.Root>
          <TextField.Root className="w-full">
            <TextField.Input
              placeholder="Password"
              type="password"
              size={'3'}
            />
          </TextField.Root>
          <Flex gap={'4'} justify={'center'} align={'center'}>
            <Dialog.Close>
              <Button size={'2'} className="w-full" variant="ghost">
                Cancel
              </Button>
            </Dialog.Close>
            <Button size={'2'} className="w-full">
              Sign Up
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};
