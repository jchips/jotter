import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Flex, Text, Button, Stack, Editable } from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';
import CreateNew from './CreateNew';
import SortSelect from '../Dashboard/SortSelect';
import './Navbar.scss';
import api from '@/util/api';
import OptionsBtn from './Options/OptionsBtn';

const Navbar = (props) => {
  const {
    logout,
    setSelectedCreate,
    setAddTitleOpen,
    setDeleteOpen,
    setMoveOpen,
    setError,
    currentFolder,
    notes,
    setNotes,
    folders,
    setFolders,
  } = props;
  const [saving, setSaving] = useState(false);
  const [showRenameBtn, setShowRenameBtn] = useState(false);
  const [folderTitle, setFolderTitle] = useState(
    currentFolder ? currentFolder.title : null
  );
  const navigate = useNavigate();

  // Update folder title
  const handleUpdateFolderTitle = async () => {
    let updateData = {
      title: folderTitle,
      updatedAt: Date.now(),
    };
    try {
      setError('');
      setSaving(true);
      await api.updateFolder(updateData, currentFolder.id);
      currentFolder.title = folderTitle;
      setShowRenameBtn(false);
    } catch (err) {
      setError('Failed to change folder title');
      console.error(err);
    }
    setSaving(false);
  };

  // Delete folder (not using)
  const handleDeleteFolder = async () => {
    try {
      setError('');
      setSaving(true);
      await api.deleteFolder(currentFolder.id);
      navigate(`/folder/${currentFolder.parentId}`);
    } catch (err) {
      setError('Failed to delete folder');
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <Box>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        align={'center'}
      >
        <Flex
          flex={{ base: 1 }}
          justify={{ base: 'center', md: 'start' }}
          align='center'
        >
          {currentFolder ? (
            <LuChevronLeft
              className='back-btn'
              onClick={() => navigate(`/folder/${currentFolder.parentId}`)}
            />
          ) : null}
          {currentFolder && currentFolder !== 'null' ? (
            <Editable.Root
              value={folderTitle}
              onValueChange={(e) => {
                setFolderTitle(e.value);
                e.value !== currentFolder.title
                  ? setShowRenameBtn(true)
                  : setShowRenameBtn(false);
              }}
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              textStyle='2xl'
              fontWeight={700}
              width='300px'
            >
              <Editable.Preview />
              <Editable.Input />
            </Editable.Root>
          ) : (
            <Text
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              textStyle='2xl'
              fontWeight={700}
            >
              Jotter
            </Text>
          )}
          {currentFolder && currentFolder !== 'null' ? (
            <Button
              className='button1'
              style={{ marginLeft: '12px' }}
              visibility={showRenameBtn ? 'visible' : 'hidden'}
              onClick={handleUpdateFolderTitle}
              disabled={saving}
            >
              Rename folder
            </Button>
          ) : null}
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {currentFolder && (
            <OptionsBtn
              setSelectedCreate={setSelectedCreate}
              setDeleteOpen={setDeleteOpen}
              setMoveOpen={setMoveOpen}
              type='folder'
            />
          )}
          <SortSelect
            notes={notes}
            folders={folders}
            setNotes={setNotes}
            setFolders={setFolders}
          />
          <Button fontSize={'sm'} fontWeight={400} onClick={logout}>
            Log out
          </Button>
          <CreateNew
            setSelectedCreate={setSelectedCreate}
            setAddTitleOpen={setAddTitleOpen}
          />
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
