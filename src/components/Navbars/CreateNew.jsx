import { useState } from 'react';
import { Box, Stack, Button } from '@chakra-ui/react';
import AddNoteTitle from '../modals/AddNoteTitle';
import {
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import CreateNewOptions from './CreateNewOptions';

const CreateNew = ({ setSelectedOption, setIsOpen }) => {
  const createNewBtn = [
    {
      label: 'Create new',
      children: [
        {
          label: 'Add Note',
          subLabel: 'note',
        },
        {
          label: 'Add Folder',
          subLabel: 'folder',
        },
      ],
    },
  ];

  return (
    <Stack direction={'row'}>
      {createNewBtn.map((navItem) => (
        <div key={navItem.label}>
          <HoverCardRoot openDelay={0} closeDelay={100}>
            <HoverCardTrigger>
              <Box className='button1 css-co8f4n' fontSize='sm'>
                <Box>{navItem.label}</Box>
                {navItem.children && (
                  <HoverCardContent
                    boxShadow='xl'
                    p={4}
                    rounded='xl'
                    minW='2xs'
                  >
                    <Stack>
                      {navItem.children.map((child) => (
                        <CreateNewOptions
                          key={child.label}
                          {...child}
                          setIsOpen={setIsOpen}
                          setSelectedOption={setSelectedOption}
                        />
                      ))}
                    </Stack>
                  </HoverCardContent>
                )}
              </Box>
            </HoverCardTrigger>
          </HoverCardRoot>
        </div>
      ))}
      {/* <AddNoteTitle
        selectedOption={selectedOption}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      /> */}
    </Stack>
  );
};

export default CreateNew;
