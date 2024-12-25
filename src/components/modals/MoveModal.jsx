'use client';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { createListCollection, Text } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import {
  DialogRoot,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import api from '@/util/api';

const MoveModal = ({ moveOpen, setMoveOpen, type, note, folder, folders }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formattedFolders, setFormattedFolders] = useState([]);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  /**
   * Fetch all folders that the user can move current folder to
   * This includes all folder except the current folder, any of the
   * current folder's inner folders, and the parent folder of the current
   * folder (because it's already in that one)
   */
  useEffect(() => {
    let folderId = note?.folderId || folder?.id;
    let parentId = note?.folderId || folder?.parentId;
    const getAllFolders = async () => {
      try {
        let res = await api.getAllFolders(folderId ? folderId : 'null', type);
        let formatFolders = res.data
          .map((folder) => {
            return {
              label: folder.title,
              value: folder.id,
              path: JSON.parse(folder.path),
            };
          })
          .filter((formattedFolder) => formattedFolder.value !== parentId); // filter out parent folder
        setFormattedFolders(formatFolders);
      } catch (err) {
        console.error('Failed to fetch folders: ', err);
      } finally {
        setLoading(false);
      }
    };
    note || folder ? getAllFolders() : null;
  }, [note, folder, folders, type]);

  /**
   * Create collection based on if a folder or note is being moved.
   * If the folder or note is not currently in the home folder, then
   * add the Home folder to the beginning of the move options list
   */
  let folderOpts;
  if (type === 'note') {
    folderOpts = createListCollection(
      !note.folderId || note.folderId === 'null'
        ? {
            items: [...formattedFolders],
          }
        : {
            items: [
              { label: 'Home', value: 'null', path: [] },
              ...formattedFolders,
            ],
          }
    );
  } else {
    folderOpts = createListCollection(
      !folder || !folder.parentId || folder.parentId === 'null'
        ? {
            items: [...formattedFolders],
          }
        : {
            items: [
              { label: 'Home', value: 'null', path: [] },
              ...formattedFolders,
            ],
          }
    );
  }

  /**
   * Moves the note or folder to chosen location
   * @param {Object[] | Integer} moveFolderId - The id of the folder to move to.
   * Chakra seems to store Select value as an array, but sometimes it works
   * as an integer without extracting it first *shrugs*
   */
  const move = async (moveFolderId) => {
    try {
      let moveToFolder;
      switch (type) {
        case 'note':
          await api.updateNote(
            {
              folderId: moveFolderId[0] === 'null' ? null : moveFolderId,
            },
            note.id
          );
          break;
        case 'folder':
          moveToFolder = await getFolder(moveFolderId);
          await api.updateFolder(
            {
              parentId: moveFolderId[0] === 'null' ? null : moveFolderId,
              path: moveToFolder
                ? [
                    ...JSON.parse(moveToFolder.path),
                    { id: moveToFolder.id, title: moveToFolder.title },
                  ]
                : [],
            },
            folder.id
          );
          folders.length !== 0 && updateInnerFolderPaths(moveToFolder);
          break;
      }
      setMoveOpen(false);
      navigate(`/folder/${moveFolderId}`);
    } catch (err) {
      setError('Failed to move folder');
      console.error('Failed to move folder - ', err);
    }
  };

  /**
   * Gets the folder that item will be moved to
   * @param {Integer} moveFolderId - The id of the folder to move to
   * @returns {Object} - The folder object
   */
  const getFolder = async (moveFolderId) => {
    try {
      let res = await api.getFolder(moveFolderId);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch folder - ', err);
      return {};
    }
  };

  /**
   * Updates the paths of all inner folders of the current folder
   * @param {Object} moveToFolder - The folder object that current folder will be moved to
   */
  const updateInnerFolderPaths = (moveToFolder) => {
    folders.forEach(async (innerFolder) => {
      try {
        await api.updateFolder(
          {
            path: [
              ...JSON.parse(moveToFolder.path),
              { id: moveToFolder.id, title: moveToFolder.title },
              { id: folder.id, title: folder.title },
            ],
          },
          innerFolder.id
        );
      } catch (err) {
        console.error(
          'Failed to update path - ',
          innerFolder.title,
          innerFolder.id,
          err
        );
      }
    });
  };

  return (
    (note || folder) &&
    !loading && (
      <DialogRoot modal={true} open={moveOpen}>
        <DialogBackdrop />
        <DialogContent ref={contentRef}>
          <DialogHeader>
            <DialogTitle>Move {type}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {error ? (
              <div style={{ marginBottom: '20px' }}>
                <Alert status='error' title={error} />
              </div>
            ) : null}
            <SelectRoot
              collection={folderOpts}
              onValueChange={(e) => {
                move(e.value);
              }}
            >
              <SelectLabel>
                Select folder to move{' '}
                <strong>{type === 'note' ? note.title : folder.title}</strong>{' '}
                to
              </SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder='Select folder' />
              </SelectTrigger>
              <SelectContent portalRef={contentRef}>
                {folderOpts.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}{' '}
                    <Text color={'GrayText'}>
                      {item.path.map((pathItem) => pathItem.title).join(' > ')}
                    </Text>
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </DialogBody>
          <DialogFooter />
          <DialogCloseTrigger onClick={() => setMoveOpen(false)} />
        </DialogContent>
      </DialogRoot>
    )
  );
};

export default MoveModal;
