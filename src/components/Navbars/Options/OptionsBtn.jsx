import { Box, Stack, Button } from '@chakra-ui/react';
import {
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import OptionsDropdown from './OptionsDropdown';

const OptionsBtn = ({ setSelectedCreate, setDeleteOpen, type }) => {
  const options = [
    {
      label: 'Options',
      children: [
        {
          label: 'Move ' + type,
          subLabel: type,
        },
        {
          label: 'Delete ' + type,
          subLabel: type,
        },
      ],
    },
  ];
  return (
    <Stack direction={'row'}>
      {options.map((navItem) => (
        <div key={navItem.label}>
          <HoverCardRoot openDelay={0} closeDelay={100}>
            <HoverCardTrigger>
              <Box className='button5'>
                <Box>{navItem.label}</Box>
                {navItem.children && (
                  <HoverCardContent boxShadow='xl' p={4} rounded='xl'>
                    <Stack>
                      {navItem.children.map((child) => (
                        <OptionsDropdown
                          key={child.label}
                          {...child}
                          setDeleteOpen={setDeleteOpen}
                          setSelectedCreate={setSelectedCreate}
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
    </Stack>
  );
};

export default OptionsBtn;
