import React from 'react';
import { useNavigate } from 'react-router';
import { Stack, Button } from '@chakra-ui/react';
import { LuSettings } from 'react-icons/lu';
import './Navbar.scss';

// Only for mobile screens
const Footer = ({ logout }) => {
  const navigate = useNavigate();
  return (
    <Stack className='dashboard-footer' direction={'row'} spacing={6}>
      <Button className='button1' onClick={() => navigate(`/settings`)}>
        <LuSettings />
      </Button>
      <Button fontSize={'sm'} fontWeight={400} onClick={logout}>
        Log out
      </Button>
    </Stack>
  );
};

export default Footer;
