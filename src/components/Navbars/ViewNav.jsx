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
import { LuTextCursorInput } from 'react-icons/lu';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import OptionsBtn from './Options/OptionsBtn';
import formatDate from '@/util/formatDate';
import './Navbar.scss';

const ViewNav = ({ note, setIsOpen, setDeleteOpen, setMoveOpen, words }) => {
  const [openPopver, setOpenPopover] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <Box className='title-bar'>
      <Flex
        className='navbar'
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor='inherit'
      >
        <Flex
          className='folder-nav'
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
        >
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            textStyle='lg'
            fontWeight={600}
          >
            {note.title}
          </Text>
        </Flex>
        <Stack
          className='navbar-btns'
          flex={{ base: 1, md: 0 }}
          direction={'row'}
        >
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
                  {note.title} <span className='medium-text'>details</span>
                </h2>
                <p>Date created: {formatDate(note.createdAt)}</p>
                <p>Last edited: {formatDate(note.updatedAt)}</p>
                <p>Word count: {words}</p>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
          <OptionsBtn
            setDeleteOpen={setDeleteOpen}
            setMoveOpen={setMoveOpen}
            type='note'
          />
          <Button
            className='button1'
            onClick={() => setIsOpen(true)}
            aria-label='Rename note'
          >
            {width > 350 ? 'Rename' : <LuTextCursorInput />}
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default ViewNav;
