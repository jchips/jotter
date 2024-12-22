import React from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';
import CreateNew from './CreateNew';
import SortSelect from '../Dashboard/SortSelect';
import './Navbar.scss';

const Navbar = (props) => {
  const {
    logout,
    setSelectedOption,
    setIsOpen,
    currentFolder,
    notes,
    setNotes,
    folders,
    setFolders,
  } = props;
  const navigate = useNavigate();
  return (
    <Box>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          align='center'
        >
          {currentFolder ? (
            <LuChevronLeft
              className='back-btn'
              onClick={() => navigate(`/folder/${currentFolder.parentId}`)}
            />
          ) : null}
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            textStyle='2xl'
            fontWeight={700}
          >
            {currentFolder ? currentFolder.title : 'Jotter'}
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <SortSelect
            notes={notes}
            folders={folders}
            setNotes={setNotes}
            setFolders={setFolders}
          />
          <Button fontSize={'sm'} fontWeight={400} onClick={logout}>
            Log out
          </Button>
          <CreateNew
            setSelectedOption={setSelectedOption}
            setIsOpen={setIsOpen}
          />
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
