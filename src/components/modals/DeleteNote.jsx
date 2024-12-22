import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
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

const DeleteConfirmation = (props) => {
  const { delConfirmOpen, setDelConfirmOpen, type, note, folder } = props;
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // deletes note
  const onSubmit = async () => {
    try {
      setError('');
      let res;
      switch (type) {
        case 'note':
          res = await api.deleteNote(note.id);
          console.log(res.data);
          break;
        case 'folder':
          break;
      }
      navigate(-1);
    } catch (err) {
      setError('Failed to delete' + type);
      console.error(err);
    }
    setDelConfirmOpen(false);
  };
  return (
    <DialogRoot modal={true} open={delConfirmOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {type}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {error ? (
            <div>
              <Alert status='error' title={error} />
            </div>
          ) : null}
          Are you sure that you want to delete{' '}
          <span style={{ fontWeight: 'bold' }}>
            {type === 'note' ? note.title : folder.title}
          </span>
          ?
          <br />
          <br />
          <span className='small-text'>This action cannot be undone.</span>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant='outline' onClick={() => setDelConfirmOpen(false)}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button className='button4' variant='solid' onClick={onSubmit}>
            Delete
          </Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={() => setDelConfirmOpen(false)} />
      </DialogContent>
    </DialogRoot>
  );
};

export default DeleteConfirmation;
