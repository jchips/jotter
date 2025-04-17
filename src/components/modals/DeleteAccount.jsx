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

const DeleteAccount = (props) => {
  const { openDeleteAcct, setOpenDeleteAcct, user, logout } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // deletes user's account
  const onSubmit = async () => {
    try {
      setError('');
      setSaving(true);
      setOpenDeleteAcct(false);
      navigate('/login');
      logout();
      await api.deleteUser(user.id);
    } catch (err) {
      setError('Failed to delete user account');
      console.error('Failed to delete user account -', err);
    }
    setSaving(false);
  };

  return (
    user && (
      <DialogRoot modal={true} open={openDeleteAcct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently Delete Account</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {error ? <ErrAlert error={error} mb={20} /> : null}
            Are you sure that you want to delete the Jotter account{' '}
            <span style={{ fontWeight: 'bold' }}>{user.email}</span>
            ?
            <br />
            <>
              <br />
              <span className='small-text'>
                This will delete all folders and notes created by{' '}
                <strong>{user.email}</strong>.
              </span>
            </>
            <br />
            <span className='small-text'>This action cannot be undone.</span>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant='outline'
                onClick={() => {
                  setOpenDeleteAcct(false);
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
              setOpenDeleteAcct(false);
              setError('');
            }}
          />
        </DialogContent>
      </DialogRoot>
    )
  );
};

export default DeleteAccount;
