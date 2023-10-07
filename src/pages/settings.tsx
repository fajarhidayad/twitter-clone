import Loading from '@/components/Loading';
import NavProfile from '@/components/NavProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Text, TextArea, TextField } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ProfileForm, profileSchema } from '@/schema/profileSchema';
import { trpc } from '@/utils/trpc';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: (res) => {
      update({ ...session, user: { ...res.data } });
      router.push(`/${res.data.username}`);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      name: session?.user?.name ?? '',
      username: session?.user?.username ?? '',
      bio: session?.user?.bio ?? '',
    },
  });

  const submit = async (data: ProfileForm) => {
    if (session && session.user.id) {
      await updateProfile.mutateAsync({
        userId: session.user.id,
        profile: data,
      });
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return (
    <>
      <Head>
        <title>Settings | Tweety</title>
      </Head>

      <NavProfile title={'Settings'} type="settings" />
      <section className="px-5 mt-3">
        <Heading mb={'3'}>Update profile</Heading>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(submit)}>
          <TextField.Root>
            <TextField.Input
              {...register('name')}
              placeholder="Name"
              type="text"
            />
          </TextField.Root>
          <Text color="red" size={'2'}>
            {errors.name?.message}
          </Text>
          <TextField.Root>
            <TextField.Slot>@</TextField.Slot>
            <TextField.Input
              {...register('username')}
              placeholder="Username"
              type="text"
            />
          </TextField.Root>
          <Text color="red" size={'2'}>
            {errors.username?.message}
          </Text>
          <TextArea {...register('bio')} placeholder="Write a bio" />
          <Text color="red" size={'2'}>
            {errors.bio?.message}
          </Text>
          <Button type="submit" className="self-end">
            Save
          </Button>
        </form>
      </section>
    </>
  );
}
