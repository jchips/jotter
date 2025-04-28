import { useState } from 'react';
import { LuLock } from 'react-icons/lu';
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
import { useForm, Controller } from 'react-hook-form';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { PasswordInput } from '@/components/ui/password-input';
import api from '@/util/api';
import ErrAlert from '../ErrAlert';
import './modal.scss';

const DeleteAccount = (props) => {
  const { openDeleteAcct, setOpenDeleteAcct, user, logout } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const fieldRequired = 'This field is required';
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
    },
  });

  /**
   * Deletes the user's account
   * @param {Object} formData - The confirmation the user submits
   */
  const onSubmit = async (formData) => {
    try {
      setError('');
      setSaving(true);
      let res = await api.deleteUser({ password: formData.password }, user.id);
      if (res.status !== 200) {
        return setError(res.data.message);
      }
      setOpenDeleteAcct(false);
      logout();
      navigate('/login');
    } catch (err) {
      if (err.status === 404) {
        setError('Incorrect password');
      } else {
        setError('Failed to delete user account');
      }
      console.error('Failed to delete user account -', err);
    }
    reset({
      password: '',
    });
    setSaving(false);
  };

  return (
    user && (
      <DialogRoot modal={true} open={openDeleteAcct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permanently Delete Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              {error ? <ErrAlert error={error} mb={20} /> : null}
              Are you sure that you want to delete the Jotter account{' '}
              <span style={{ fontWeight: 'bold' }}>{user.email}</span>?
              <Field
                className='field'
                label='To delete Jotter account, confirm your password'
                errorText={fieldRequired}
                invalid={errors.password}
                required
              >
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputGroup flex='1' startElement={<LuLock />}>
                      <PasswordInput
                        type='password'
                        value={value}
                        onChange={onChange}
                        placeholder='Enter password'
                      />
                    </InputGroup>
                  )}
                />
              </Field>
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
                type='submit'
                className='button4'
                variant='solid'
                disabled={saving}
              >
                Delete
              </Button>
            </DialogFooter>
          </form>
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
