import { useState } from 'react';
import { LuLock, LuMail } from 'react-icons/lu';
import { useForm, Controller } from 'react-hook-form';
import { Input, Stack } from '@chakra-ui/react';
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
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { setToken } from '@/util/authUtil';
import api from '@/util/api';
import ErrAlert from '../ErrAlert';

const UpdateAccount = (props) => {
  const { openUpdateAcct, setOpenUpdateAcct, user } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { setUser } = useAuth();
  const fieldRequired = 'This field is required';
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email,
      newPassword: '',
      confirmPassword: '',
      password: '',
    },
  });

  /**
   * Updates the user's account information
   * @param {Object} formData - The login data the user submits
   */
  const onSubmit = async (formData) => {
    try {
      setSaving(true);
      setError('');
      if (formData.newPassword !== formData.confirmPassword) {
        setSaving(false);
        return setError('New passwords do not match');
      }
      let updates = {};
      if (formData.email.trim() !== user?.email) {
        const isEmailAddr =
          /^[a-zA-z]+(\.)*(-)*(_)*[a-zA-z]*(@)[a-zA-z]+(\.)[a-zA-z]+$/gm;
        if (!isEmailAddr.test(formData.email)) {
          setSaving(false);
          return setError('Must use a valid email address');
        }
        updates.email = formData.email.trim();
      }
      if (formData.newPassword) {
        updates.newPassword = formData.newPassword;
      }
      updates.password = formData.password;
      let res = await api.updateUser(updates, user?.id);
      if (res.status !== 200) {
        return setError(res.data.message);
      }
      setUser(res.data);
      setToken(res.data.token);
      setOpenUpdateAcct(false);
    } catch (err) {
      if (err.status === 404) {
        setError('Incorrect password');
      } else {
        setError(err.message);
      }
      console.error('Failed to update account -', err);
    } finally {
      reset({
        email: user?.email,
        newPassword: '',
        confirmPassword: '',
        password: '',
      });
      setSaving(false);
    }
  };

  return (
    user && (
      <DialogRoot modal={true} open={openUpdateAcct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Account Info</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogBody>
              {error ? <ErrAlert error={error} mb={20} /> : null}
              <Stack gap='4' w='full'>
                <Field
                  label='Email'
                  errorText={fieldRequired}
                  invalid={errors.email}
                  required
                >
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <InputGroup flex='1' startElement={<LuMail />}>
                        <Input
                          type='email'
                          value={value}
                          onChange={onChange}
                          placeholder='Email'
                        />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field
                  label='Current password'
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
                          placeholder='Current password'
                        />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field
                  label='New password'
                  errorText={errors.newPassword}
                  invalid={errors.newPassword}
                >
                  <Controller
                    name='newPassword'
                    control={control}
                    rules={{
                      required: false,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <InputGroup flex='1' startElement={<LuLock />}>
                        <PasswordInput
                          type='new-password'
                          value={value}
                          onChange={onChange}
                          placeholder='New password'
                        />
                      </InputGroup>
                    )}
                  />
                </Field>
                <Field
                  label='Confirm new password'
                  errorText={errors.confirmPassword}
                  invalid={errors.confirmPassword}
                >
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{
                      required: false,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <InputGroup flex='1' startElement={<LuLock />}>
                        <PasswordInput
                          type='password'
                          value={value}
                          onChange={onChange}
                          placeholder='Repeat new password'
                        />
                      </InputGroup>
                    )}
                  />
                </Field>
              </Stack>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button
                  variant='outline'
                  onClick={() => {
                    setOpenUpdateAcct(false);
                    setError('');
                  }}
                >
                  Cancel
                </Button>
              </DialogActionTrigger>
              <Button
                type='submit'
                className='button1'
                variant='solid'
                disabled={saving}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
          <DialogCloseTrigger
            onClick={() => {
              setOpenUpdateAcct(false);
              setError('');
            }}
          />
        </DialogContent>
      </DialogRoot>
    )
  );
};

export default UpdateAccount;
