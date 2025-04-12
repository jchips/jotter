import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Flex, Text, Button, Stack, Editable } from '@chakra-ui/react';
import { LuChevronLeft, LuSettings } from 'react-icons/lu';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import CreateNew from './Create/CreateNew';
import SortSelect from '../Dashboard/SortSelect';
import OptionsBtn from './Options/OptionsBtn';
import api from '@/util/api';
import jotterGif from '@/assets/ic/jotter4.gif';
import './Navbar.scss';

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
    folders,
  } = props;
  const [saving, setSaving] = useState(false);
  const [showRenameBtn, setShowRenameBtn] = useState(false);
  const [folderTitle, setFolderTitle] = useState(
    currentFolder ? currentFolder.title : null
  );
  const { width } = useWindowDimensions();
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
      {
        folders?.length !== 0 && getChildren(currentFolder.id);
      }
      setShowRenameBtn(false);
    } catch (err) {
      setError('Failed to change folder title');
      console.error(err);
    }
    setSaving(false);
  };

  /**
   * Updates the path of the child folder given
   * @param {Object} child - The folder to update
   */
  const updateInnerPath = async (child) => {
    let childPath =
      typeof child.path === 'string' ? JSON.parse(child.path) : child.path;
    let index = childPath.findIndex(
      (pathItem) => pathItem.id === currentFolder.id
    );
    childPath.splice(index, 1, {
      id: currentFolder.id,
      title: currentFolder.title,
    });
    try {
      await api.updateFolder(
        {
          path: childPath,
        },
        child.id
      );
    } catch (err) {
      console.error('Failed to update path - ', child.title, child.id, err);
    }
  };

  /**
   * Gets the child folders of the current folder and updates their paths.
   * @param {Integer} parentId - The id of the current folder (it will the parent on recall)
   * @returns - exit the recursive function once there are no more child folders
   */
  const getChildren = async (parentId) => {
    try {
      let children = await api.getFolders(parentId);
      children = children.data;
      if (children.length === 0) {
        return;
      } else {
        for (const child of children) {
          await updateInnerPath(child);
          await getChildren(child.id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch child folders', err);
    }
  };

  return (
    <Flex
      className='navbar'
      minH={'60px'}
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={'lightgray'}
      align={'center'}
    >
      <Flex
        className='folder-nav'
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
            maxWidth='300px'
          >
            <Editable.Preview />
            <Editable.Input />
          </Editable.Root>
        ) : (
          <Flex direction='row' alignItems='center'>
            <img className='gif' src={jotterGif} alt='Jotter gif' />
            <Text
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              textStyle='2xl'
              fontWeight={700}
              marginLeft='10px'
            >
              Jotter
            </Text>
          </Flex>
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
        className='navbar-btns'
        flex={{ base: 1, md: 0 }}
        direction={'row'}
        spacing={6}
      >
        <CreateNew
          setSelectedCreate={setSelectedCreate}
          setAddTitleOpen={setAddTitleOpen}
        />
        <SortSelect notes={notes} folders={folders} />
        {currentFolder && (
          <OptionsBtn
            setDeleteOpen={setDeleteOpen}
            setMoveOpen={setMoveOpen}
            type='folder'
          />
        )}
        {width > 768 && (
          <>
            <Button className='button1' onClick={() => navigate(`/settings`)}>
              <LuSettings />
            </Button>
            <Button fontSize={'sm'} fontWeight={400} onClick={logout}>
              Log out
            </Button>
          </>
        )}
      </Stack>
    </Flex>
  );
};

export default Navbar;
