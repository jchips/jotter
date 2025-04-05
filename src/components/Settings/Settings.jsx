'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Text, Stack, Switch, Card, Button } from '@chakra-ui/react';
import { setConfigs } from '@/reducers';
import { useAuth } from '@/hooks/useAuth';
import { getLocalConfigs, setLocalConfigs } from '@/util/configUtil';
import SettingsNav from '../Navbars/SettingsNav';
import ExportAllButton from './ExportAllButton';
import './Settings.scss';

const Settings = () => {
  const configs = useSelector((state) => state.configs.value);
  const localConfigs = getLocalConfigs();
  const [error, setError] = useState('');
  const [hideWordCount, setHideWordCount] = useState(
    configs?.hideWordCount || localConfigs?.hideWordCount
  );
  const [highlightActiveLine, setHighlightActiveLine] = useState(
    configs?.highlightActiveLine || localConfigs?.highlightActiveLine
  );
  const { user } = useAuth();
  const dispatch = useDispatch();
  const themeText = '#646cff';

  return (
    <div>
      <SettingsNav />
      {error ? (
        <div style={{ marginBottom: '20px' }}>
          <Alert status='error' title={error} />
        </div>
      ) : null}
      <Text
        textAlign={{ base: 'center' }}
        fontFamily={'heading'}
        textStyle='xl'
        fontWeight={600}
        marginTop={10}
        marginBottom={10}
        color={themeText}
      >
        {user?.email}
      </Text>
      <Text
        textAlign='center'
        fontFamily={'heading'}
        textStyle='lg'
        fontWeight={600}
        marginTop={5}
        marginBottom={5}
      >
        Editor
      </Text>
      <Stack align='center'>
        <Card.Root size='md' className='settings-card'>
          <Card.Body className='settings-card__body'>
            <Text>Hide Word Count</Text>
            <Switch.Root
              checked={hideWordCount}
              onCheckedChange={(e) => setHideWordCount(e.checked)}
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
        <Card.Root size='md' className='settings-card'>
          <Card.Body className='settings-card__body'>
            <Text>Highlight active line</Text>
            <Switch.Root
              checked={highlightActiveLine}
              onCheckedChange={(e) => setHighlightActiveLine(e.checked)}
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
      </Stack>
      <Text
        textAlign='center'
        fontFamily={'heading'}
        textStyle='lg'
        fontWeight={600}
        marginTop={5}
        marginBottom={5}
      >
        Notes / Folders
      </Text>
      <Stack align={'center'}>
        <Card.Root size='md' className='settings-card'>
          <Card.Body className='settings-card__body'>
            <Text>Export all folders and notes</Text>
            <ExportAllButton setError={setError} />
          </Card.Body>
        </Card.Root>
      </Stack>
    </div>
  );
};

export default Settings;
