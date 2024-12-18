import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import CreateNew from './CreateNew';

const DashboardNav = (props) => {
  const { logout, setSelectedOption, setIsOpen } = props;
  return (
    <Box>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        // borderColor={}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            // color={'#646cff'}
            textStyle='2xl'
            fontWeight={700}
          >
            Dashboard
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
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

export default DashboardNav;
