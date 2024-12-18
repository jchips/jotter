import { Box, Stack, Text, Flex, Icon, Button } from '@chakra-ui/react';
import { LuChevronRight, LuFolder, LuStickyNote } from 'react-icons/lu';

const CreateNewOptions = ({
  label,
  subLabel,
  isOpen,
  setIsOpen,
  setSelectedOption,
}) => {
  const iconStyle = {
    height: '20px',
    width: '20px',
    color: '#646cff',
  };
  return (
    <Button
      as='a'
      role='group'
      display='block'
      p='2'
      rounded='md'
      variant='surface'
      onClick={() => {
        subLabel === 'note'
          ? setSelectedOption('note')
          : setSelectedOption('folder');
        setIsOpen(true);
      }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Stack direction={'row'}>
            {subLabel === 'note' ? (
              <LuStickyNote style={iconStyle} />
            ) : (
              <LuFolder style={iconStyle} />
            )}
            <Text transition='all .3s ease'>{label}</Text>
          </Stack>
        </Box>
        <Flex
          transition='all .3s ease'
          transform='translateX(-10px)'
          opacity='0'
          _hover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify='flex-end'
          align='center'
          flex='1'
        >
          <LuChevronRight style={iconStyle} />
        </Flex>
      </Stack>
    </Button>
  );
};

export default CreateNewOptions;
