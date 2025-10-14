'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, Stack, Card, Button } from '@chakra-ui/react'
import { setConfigs } from '@/reducers'
import { useAuth } from '@/hooks/useAuth'
import { getLocalConfigs, setLocalConfigs } from '@/util/configUtil'
import api from '@/util/api'
import UpdateAccount from '../modals/UpdateAccount'
import DeleteAccount from '../modals/DeleteAccount'
import SettingsNav from '../Navbars/SettingsNav'
import ExportAllButton from './ExportAllButton'
import ToggleCard from './ToggleCard'
import ErrAlert from '../ErrAlert'
import './Settings.scss'
import ImportAllButton from './ImportAllButton'

const Settings = () => {
  const configs = useSelector((state) => state.configs.value)
  const localConfigs = getLocalConfigs()
  const [error, setError] = useState('')
  const [hideWordCount, setHideWordCount] = useState(
    configs?.hideWordCount || localConfigs?.hideWordCount
  )
  const [highlightActiveLine, setHighlightActiveLine] = useState(
    configs?.highlightActiveLine || localConfigs?.highlightActiveLine
  )
  const [openUpdateAcct, setOpenUpdateAcct] = useState(false)
  const [openDeleteAcct, setOpenDeleteAcct] = useState(false)
  const { user, logout } = useAuth()
  const dispatch = useDispatch()
  const themeText = '#646cff'
  const toggleOptions = [
    {
      settingState: hideWordCount,
      settingOption: 'toggleWordCount',
      settingText: 'Hide Word Count',
    },
    {
      settingState: highlightActiveLine,
      settingOption: 'toggleHighLightActiveLine',
      settingText: 'Highlight active line',
    },
  ]

  useEffect(() => {
    const fetchConfigs = async () => {
      let uConfigs = await api.getConfigs()
      setHideWordCount(uConfigs.data?.hideWordCount)
      setHighlightActiveLine(uConfigs.data?.highlightActiveLine)
      dispatch(setConfigs(uConfigs.data))
      setLocalConfigs(uConfigs.data)
    }
    fetchConfigs()
  }, [dispatch])

  /**
   * Adds the new config changes to the database
   * @param {Object} updates - Updates to add to database
   */
  const dbUpdate = async (updates) => {
    try {
      setError('')
      let res = await api.updateConfigs(updates)
      dispatch(setConfigs({ ...res.data, ...updates }))
    } catch (err) {
      setError('Failed to update settings')
      console.error('Failed to update user configs -', err)
    }
  }

  /**
   * Updates the configs based on user changes
   * @param {String} setting - The setting / config to be updated
   * @param {Boolean} settingState - The updated toggle state
   * @returns {Function} - Calls `dbUpdate()` to update settings
   */
  const updateSettings = (setting, settingState) => {
    switch (setting) {
      case 'toggleWordCount': {
        setHideWordCount(settingState)
        return dbUpdate({ hideWordCount: settingState })
      }
      case 'toggleHighLightActiveLine': {
        setHighlightActiveLine(settingState)
        return dbUpdate({ highlightActiveLine: settingState })
      }
    }
  }

  return (
    <div className='settings__container'>
      <SettingsNav />
      {error ? <ErrAlert error={error} m={20} /> : null}
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
        {toggleOptions.map((settingOption) => (
          <ToggleCard
            key={settingOption.settingOption}
            toggleData={settingOption}
            updateSettings={updateSettings}
          />
        ))}
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
            <Text>Import (zip file)</Text>
            <ImportAllButton setError={setError} />
          </Card.Body>
        </Card.Root>
        <Card.Root size='md' className='settings-card'>
          <Card.Body className='settings-card__body'>
            <Text>Export all notes and folders</Text>
            <ExportAllButton setError={setError} />
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
        Account
      </Text>
      <Stack align={'center'}>
        <Card.Root size='md' className='settings-card'>
          <Card.Body className='settings-card__body'>
            <Text>Update account info</Text>
            <Button className='button1' onClick={() => setOpenUpdateAcct(true)}>
              Update login
            </Button>
          </Card.Body>
        </Card.Root>
        <Card.Root size='md' className='settings-card'>
          <Card.Body className='settings-card__body'>
            <Text>Permanently delete account</Text>
            <Button className='button2' onClick={() => setOpenDeleteAcct(true)}>
              Delete account
            </Button>
          </Card.Body>
        </Card.Root>
      </Stack>
      <UpdateAccount
        openUpdateAcct={openUpdateAcct}
        setOpenUpdateAcct={setOpenUpdateAcct}
        user={user}
      />
      <DeleteAccount
        openDeleteAcct={openDeleteAcct}
        setOpenDeleteAcct={setOpenDeleteAcct}
        user={user}
        logout={logout}
      />
    </div>
  )
}

export default Settings
