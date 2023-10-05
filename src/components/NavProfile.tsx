import { IconButton, Heading, Text } from '@radix-ui/themes';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface NavProfileProps {
  title: string;
  type: 'settings' | 'profile';
}

const NavProfile = ({ title, type }: NavProfileProps) => {
  const router = useRouter();
  return (
    <nav className="px-5 py-3 sticky top-0 backdrop-blur z-50 flex items-center gap-6">
      <IconButton variant="ghost" size={'3'} onClick={() => router.back()}>
        <span className="text-xl">
          <FaArrowLeft />
        </span>
      </IconButton>

      <div>
        <Heading>{title}</Heading>
        {type === 'profile' && (
          <Text size={'2'} color="gray">
            10 posts
          </Text>
        )}
      </div>
    </nav>
  );
};

export default NavProfile;
