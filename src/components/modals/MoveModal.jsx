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
            let path =
              typeof folder.path === 'string'
                ? JSON.parse(folder.path)
                : folder.path;
            return {
              label: folder.title,
              value: folder.id,
              path: path,
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
   * @param {Object[] | Integer} folderTargetId - The id of the folder to move to.
   * Chakra seems to store Select value as an array, but sometimes it works
   * as an integer without extracting it first *shrugs*
   */
  const move = async (folderTargetId) => {
    try {
      let moveToFolder = await getFolder(folderTargetId);
      let parsedTargetPath =
        typeof moveToFolder.path === 'string'
          ? JSON.parse(moveToFolder.path)
          : moveToFolder.path;
      switch (type) {
        case 'note':
          await api.updateNote(
            {
              folderId: folderTargetId[0] === 'null' ? null : folderTargetId,
            },
            note.id
          );
          break;
        case 'folder': {
          let res = await api.updateFolder(
            {
              parentId: folderTargetId[0] === 'null' ? null : folderTargetId,
              path: moveToFolder
                ? [
                    ...parsedTargetPath,
                    { id: moveToFolder.id, title: moveToFolder.title },
                  ]
                : [],
            },
            folder.id
          );
          let updatedFolderPath =
            typeof res.data.path === 'string'
              ? JSON.parse(res.data.path)
              : res.data.path;
          folders?.length !== 0 &&
            getChildren(
              folder.id,
              moveToFolder,
              updatedFolderPath,
              folder.path
            );
          break;
        }
      }
      setMoveOpen(false);
      navigate(`/folder/${folderTargetId}`);
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
   * Updates the path of the child folder given
   * @param {Object} child - The folder to update
   * @param {Object} moveToFolder - The folder that current folder will be moved to
   * @param {Object[]} folderPath - The updated path of the current folder
   * @param {Object[]} orgFolderPath - The original path of the current folder
   */
  const updateInnerPath = async (
    child,
    moveToFolder,
    folderPath,
    orgFolderPath
  ) => {
    let path;
    let childPath =
      typeof child.path === 'string' ? JSON.parse(child.path) : child.path;
    let parsedTargetPath =
      typeof moveToFolder.path === 'string'
        ? JSON.parse(moveToFolder.path)
        : moveToFolder.path;
    let index = childPath.findIndex(
      (pathItem) => pathItem.id === folder.id && pathItem.title === folder.title
    );
    let updatedChildPath = childPath.slice(index + 1);
    if (orgFolderPath.length === 0 && moveToFolder) {
      // Moving from root to a new folder
      path = [
        ...parsedTargetPath,
        { id: moveToFolder.id, title: moveToFolder.title },
        ...updatedChildPath,
      ];
    } else {
      // Moving from one folder to another
      path = [
        ...folderPath,
        { id: folder.id, title: folder.title },
        ...updatedChildPath,
      ];
    }
    try {
      await api.updateFolder(
        {
          path: path,
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
   * @param {Object} moveToFolder - The folder that current folder will be moved to
   * @param {Object[]} folderPath - The updated path of the current folder
   * @param {Object} orgFolderPath - The original path of the current folder
   * @returns - exit the recursive function once there are no more child folders
   */
  const getChildren = async (
    parentId,
    moveToFolder,
    folderPath,
    orgFolderPath
  ) => {
    try {
      let children = await api.getFolders(parentId);
      children = children.data;
      if (children.length === 0) {
        return;
      } else {
        for (const child of children) {
          await updateInnerPath(child, moveToFolder, folderPath, orgFolderPath);
          await getChildren(child.id, moveToFolder, folderPath, orgFolderPath);
        }
      }
    } catch (err) {
      console.error('Failed to fetch child folders', err);
    }
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
                {folderOpts.items.length < 1 ? (
                  <Text>No folder options</Text>
                ) : (
                  folderOpts.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                      {item.label}{' '}
                      <Text color={'GrayText'}>
                        {item.path
                          .map((pathItem) => pathItem.title)
                          .join(' > ')}
                      </Text>
                    </SelectItem>
                  ))
                )}
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
