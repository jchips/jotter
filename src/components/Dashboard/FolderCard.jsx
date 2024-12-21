import { useNavigate, Link } from 'react-router';
import { Card, Heading, HStack, Button } from '@chakra-ui/react';
import { LuFolder } from 'react-icons/lu';
import formatDate from '@/util/formatDate';

const FolderCard = ({ folder }) => {
  const navigate = useNavigate();
  return (
    <Card.Root
      size='sm'
      className='folder-card'
      as={Link}
      to={{ pathname: `/folder/${folder.id}`, pathState: { folder: folder } }}
      // onDoubleClick={() => navigate(`/preview/${.id}`)}
    >
      <Card.Body>
        <HStack spacing={4}>
          <LuFolder />
          <Heading size='md'>{folder.title}</Heading>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default FolderCard;
