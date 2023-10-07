import { Flex, IconButton, Text } from '@radix-ui/themes';
import { BsChat, BsHeart } from 'react-icons/bs';
import { FaRetweet } from 'react-icons/fa';

interface ReactionProps {
  likes: number;
  replies: number;
}

const Reaction = ({ likes, replies }: ReactionProps) => {
  return (
    <Flex py={'3'} px={'6'} justify={'between'} align={'center'}>
      <Flex align={'center'} gap={'2'}>
        <IconButton variant="ghost" size={'3'} color="gray">
          <BsChat />
        </IconButton>
        <Text size={'2'} color="gray">
          {replies}
        </Text>
      </Flex>
      <Flex align={'center'} gap={'2'}>
        <IconButton variant="ghost" size={'3'} color="gray">
          <FaRetweet />
        </IconButton>
        <Text size={'2'} color="gray">
          {0}
        </Text>
      </Flex>
      <Flex align={'center'} gap={'2'}>
        <IconButton variant="ghost" color="gray" size={'3'}>
          <BsHeart />
        </IconButton>
        <Text size={'2'} color="gray">
          {likes}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Reaction;
