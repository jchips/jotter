import { Card, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import formatDate from '@/util/formatDate';

const NoteCard = ({ note }) => {
  const navigate = useNavigate();

  return (
    <Card.Root
      size='sm'
      className='note-card'
      // _hover={{ backgroundColor: '#f4f4f5' }}
      onDoubleClick={() => navigate(`/preview/${note.id}`)}
    >
      <Card.Header>
        <Heading size='md'>{note.title}</Heading>
      </Card.Header>
      <Card.Body color='fg.muted'>
        <p>Date created: {formatDate(note.createdAt)}</p>
        <p>Last modified: {formatDate(note.updatedAt)}</p>
      </Card.Body>
    </Card.Root>
  );
};

export default NoteCard;
