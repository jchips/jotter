import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import formatDate from '@/util/formatDate';
import './Navbar.scss';

const Title = ({ note, setIsOpen, setDelConfirmOpen }) => {
  const [openPopver, setOpenPopover] = useState(false);
  return (
    <Box className='navbar'>
      <Flex minH={'60px'} py={{ base: 2 }} px={{ base: 4 }} align={'center'}>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          // direction='column'
        >
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            textStyle='lg'
            fontWeight={500}
          >
            {note.title}
          </Text>
        </Flex>
        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'}>
          <PopoverRoot
            open={openPopver}
            onOpenChange={(e) => setOpenPopover(e.open)}
          >
            <PopoverTrigger asChild>
              <Button
                textAlign={useBreakpointValue({
                  base: 'center',
                  md: 'left',
                })}
                variant='outline'
                className='small-text details-text'
                onClick={() => setOpenPopover(true)}
              >
                View details
              </Button>
            </PopoverTrigger>
            <PopoverContent className='details-popover'>
              <PopoverArrow />
              <PopoverBody>
                <h2>
                  {note.title} <span className='medium-text'>- details</span>
                </h2>
                <p>Date created: {formatDate(note.createdAt)}</p>
                <p>Last edited: {formatDate(note.updatedAt)}</p>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
          <Button className='button1' onClick={() => setIsOpen(true)}>
            Rename
          </Button>
          <Button className='button2' onClick={() => setDelConfirmOpen(true)}>
            Delete
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Title;
