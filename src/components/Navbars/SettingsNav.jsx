import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Flex, Text, Stack, Button } from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';
import { useAuth } from '@/hooks/useAuth';
import './Navbar.scss';

const SettingsNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // logs user out
  const logUserOut = () => {
    navigate('/login');
    logout();
  };

  return (
    <Box>
      <Flex
        className='settings-navbar'
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
      >
        <Flex
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          align='center'
        >
          <LuChevronLeft className='back-btn' onClick={() => navigate(-1)} />
          <Text
            textAlign={{ base: 'center', md: 'left' }}
            fontFamily={'heading'}
            textStyle='2xl'
            fontWeight={700}
            marginLeft='10px'
          >
            Settings
          </Text>
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            className='button2 logout-btn'
            fontSize={'sm'}
            fontWeight={400}
            onClick={logUserOut}
          >
            Log out
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default SettingsNav;
