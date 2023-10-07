import { Flex, IconButton } from '@radix-ui/themes';
import { BsChat, BsHeart } from 'react-icons/bs';
import { FaRetweet } from 'react-icons/fa';

const Reaction = () => {
  return (
    <Flex py={'3'} px={'6'} justify={'between'} align={'center'}>
      <IconButton variant="ghost" size={'3'} color="gray">
        <BsChat />
      </IconButton>
      <IconButton variant="ghost" size={'3'} color="gray">
        <FaRetweet />
      </IconButton>
      <IconButton variant="ghost" color="gray" size={'3'}>
        <BsHeart />
      </IconButton>
    </Flex>
  );
};

export default Reaction;
