import { trpc } from '@/utils/trpc';
import { Flex, IconButton, Text } from '@radix-ui/themes';
import { BsChat, BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaRetweet } from 'react-icons/fa';

interface ReactionProps {
  likes: number;
  replies: number;
  tweetId: number;
  likedByUser: boolean;
}

const Reaction = ({ likes, replies, tweetId, likedByUser }: ReactionProps) => {
  const utils = trpc.useContext();
  const likeMut = trpc.tweet.like.useMutation({
    onSuccess: () => {
      utils.tweet.findById.invalidate({ id: tweetId });
      utils.tweet.getAll.invalidate();
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMut.mutate({ tweetId });
  };
  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Flex py={'3'} px={'6'} justify={'between'} align={'center'}>
      <Flex align={'center'} gap={'2'}>
        <IconButton
          variant="ghost"
          size={'3'}
          color="gray"
          onClick={handleReply}
        >
          <BsChat />
        </IconButton>
        <Text size={'2'} color="gray">
          {replies}
        </Text>
      </Flex>
      <Flex align={'center'} gap={'2'}>
        <IconButton
          variant="ghost"
          size={'3'}
          color="gray"
          onClick={handleRetweet}
        >
          <FaRetweet />
        </IconButton>
        <Text size={'2'} color="gray">
          {0}
        </Text>
      </Flex>
      <Flex align={'center'} gap={'2'}>
        <IconButton
          variant="ghost"
          color="gray"
          size={'3'}
          onClick={handleLike}
        >
          {likedByUser ? <BsHeartFill className="text-red-500" /> : <BsHeart />}
        </IconButton>
        <Text size={'2'} color="gray">
          {likes}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Reaction;
