import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DialogRoot,
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import api from '@/util/api';
import ErrAlert from '../ErrAlert';

const DeleteItem = (props) => {
  const { deleteOpen, setDeleteOpen, type, note, folder } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // deletes note or folder
  const onSubmit = async () => {
    try {
      setError('');
      setSaving(true);
      switch (type) {
        case 'note':
          await api.deleteNote(note.id);
          navigate(`/folder/${note.folderId ? note.folderId : 'null'}`);
          break;
        case 'folder':
          await api.deleteFolder(folder.id);
          navigate(`/folder/${folder.parentId ? folder.parentId : 'null'}`);
          break;
      }
      setDeleteOpen(false);
    } catch (err) {
      setError('Failed to delete ' + type);
      console.error(err);
    }
    setSaving(false);
  };

  return (
    (note || folder) && (
      <DialogRoot modal={true} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {type}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {error ? <ErrAlert error={error} mb={20} /> : null}
            Are you sure that you want to delete{' '}
            <span style={{ fontWeight: 'bold' }}>
              {type === 'note' ? note.title : folder.title}
            </span>
            ?
            <br />
            {type === 'folder' ? (
              <>
                <br />
                <span className='small-text'>
                  This will delete all folders and notes stored in{' '}
                  <strong>{folder.title}</strong>.
                </span>
              </>
            ) : null}
            <br />
            <span className='small-text'>This action cannot be undone.</span>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant='outline'
                onClick={() => {
                  setDeleteOpen(false);
                  setError('');
                }}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              className='button4'
              variant='solid'
              onClick={onSubmit}
              disabled={saving}
            >
              Delete
            </Button>
          </DialogFooter>
          <DialogCloseTrigger
            onClick={() => {
              setDeleteOpen(false);
              setError('');
            }}
          />
        </DialogContent>
      </DialogRoot>
    )
  );
};

export default DeleteItem;
