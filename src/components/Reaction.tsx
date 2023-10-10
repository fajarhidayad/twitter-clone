import { trpc } from '@/utils/trpc';
import {
  Dialog,
  Flex,
  IconButton,
  Popover,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { BsChat, BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaRetweet, FaPen } from 'react-icons/fa';

interface ReactionProps {
  likes: number;
  replies: number;
  retweet: number;
  tweetId: number;
  likedByUser?: boolean;
  retweetedByUser?: boolean;
}

export default function Reaction({
  likes,
  replies,
  retweet,
  tweetId,
  likedByUser,
  retweetedByUser,
}: ReactionProps) {
  const utils = trpc.useContext();
  const likeMut = trpc.tweet.like.useMutation({
    onSuccess: () => {
      utils.tweet.findById.invalidate({ id: tweetId });
      utils.tweet.getAll.invalidate();
    },
  });

  const retweetMut = trpc.tweet.retweet.useMutation({
    onSuccess: () => {
      utils.tweet.findById.invalidate({ id: tweetId });
      utils.tweet.getAll.invalidate();
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMut.mutate({ tweetId });
  };
  const handleRetweet = (text: string | null) => {
    retweetMut.mutate({ tweetId, text });
  };
  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Flex py={'3'} px={'6'} justify={'between'} align={'center'}>
      <Flex align={'center'} gap={'2'}>
        <Tooltip content="Reply">
          <IconButton
            variant="ghost"
            size={'3'}
            color="gray"
            onClick={handleReply}
          >
            <BsChat />
          </IconButton>
        </Tooltip>
        <Text size={'2'} color="gray">
          {replies}
        </Text>
      </Flex>
      <Flex align={'center'} gap={'2'}>
        <Tooltip content="Retweet">
          <RetweetPopover
            handleRetweet={handleRetweet}
            retweetedByUser={retweetedByUser}
          />
        </Tooltip>
        <Text size={'2'} color="gray">
          {retweet}
        </Text>
      </Flex>
      <Flex align={'center'} gap={'2'}>
        <Tooltip content={likedByUser ? 'Unlike' : 'Like'}>
          <IconButton
            variant="ghost"
            color="gray"
            size={'3'}
            onClick={handleLike}
          >
            {likedByUser ? (
              <BsHeartFill className="text-red-500" />
            ) : (
              <BsHeart />
            )}
          </IconButton>
        </Tooltip>
        <Text size={'2'} color="gray">
          {likes}
        </Text>
      </Flex>
    </Flex>
  );
}

const RetweetPopover = ({
  handleRetweet,
  retweetedByUser,
}: {
  handleRetweet: (text: string | null) => void;
  retweetedByUser?: boolean;
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton
          variant="ghost"
          size={'3'}
          color={retweetedByUser ? 'blue' : 'gray'}
          onClick={(e) => e.stopPropagation()}
        >
          <FaRetweet />
        </IconButton>
      </Popover.Trigger>

      <Popover.Content>
        <Flex
          align={'center'}
          gap={'3'}
          px={'3'}
          py={'2'}
          className="hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleRetweet(null);
          }}
        >
          <FaRetweet />
          <Text>{retweetedByUser ? 'Cancel Retweet' : 'Retweet'}</Text>
        </Flex>
        <Flex
          align={'center'}
          gap={'3'}
          px={'3'}
          py={'2'}
          className="hover:bg-gray-100 rounded-md cursor-pointer"
        >
          <FaPen />
          <Text>Quote</Text>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};

const RetweetDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger></Dialog.Trigger>
    </Dialog.Root>
  );
};
