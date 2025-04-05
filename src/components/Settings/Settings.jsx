'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Text, Stack, Switch, Card } from '@chakra-ui/react';
import { setConfigs } from '@/reducers';
import { useAuth } from '@/hooks/useAuth';
import { getLocalConfigs, setLocalConfigs } from '@/util/configUtil';
import api from '@/util/api';
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

  useEffect(() => {
    const fetchConfigs = async () => {
      let uConfigs = await api.getConfigs();
      setHideWordCount(uConfigs.data?.hideWordCount);
      setHighlightActiveLine(uConfigs.data?.highlightActiveLine);
      dispatch(setConfigs(uConfigs.data));
      setLocalConfigs(uConfigs.data);
    };
    fetchConfigs();
  }, [dispatch]);

  /**
   * Adds the new config changes to the database
   * @param {Object} updates - Updates to add to database
   */
  const dbUpdate = async (updates) => {
    try {
      setError('');
      let res = await api.updateConfigs(updates);
      dispatch(setConfigs({ ...res.data, ...updates }));
    } catch (err) {
      setError('Failed to update settings');
      console.error('Failed to update user configs -', err);
    }
  };

  /**
   * Updates the configs based on user changes
   * @param {String} setting - The setting /config to be updated
   * @returns {Function} - Calls `dbUpdate()` to update settings
   */
  const updateSettings = (setting, settingState) => {
    console.log('settingState', settingState); // dl
    switch (setting) {
      case 'toggleWordCount': {
        setHideWordCount(settingState);
        return dbUpdate({ hideWordCount: settingState });
      }
      case 'toggleHighLightActiveLine': {
        setHighlightActiveLine(settingState);
        return dbUpdate({ highlightActiveLine: settingState });
      }
    }
  };

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
              onCheckedChange={(e) =>
                updateSettings('toggleWordCount', e.checked)
              }
              // onCheckedChange={(e) => setHideWordCount(e.checked)}
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
              onCheckedChange={(e) =>
                updateSettings('toggleHighLightActiveLine', e.checked)
              }
              // onCheckedChange={(e) => setHighlightActiveLine(e.checked)}
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
