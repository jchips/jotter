import React from 'react';
import { Card, Switch, Text } from '@chakra-ui/react';

const ToggleCard = ({ toggleData, updateSettings }) => {
  const { settingState, settingOption, settingText } = toggleData;
  const themeText = '#646cff';
  return (
    <Card.Root size='md' className='settings-card'>
      <Card.Body className='settings-card__body'>
        <Text>{settingText}</Text>
        <Switch.Root
          checked={settingState}
          onCheckedChange={(e) => updateSettings(settingOption, e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control
            _checked={{
              bg: themeText,
            }}
          >
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label />
        </Switch.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default ToggleCard;
