import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@chakra-ui/react';
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
import api from '@/util/api';
import ErrAlert from '../ErrAlert';

const ChangeTitle = (props) => {
  const { isOpen, setIsOpen, setNote, note } = props;
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: note.title,
    },
  });

  /**
   * Changes the title of a note
   * Changing title of folder is in `Navbar.jsx`
   * @param {Object} titleControl - The input the user types as a title
   */
  const onSubmit = async (titleControl) => {
    try {
      setError('');
      setSaving(true);
      let res = await api.updateNote(
        {
          title: titleControl.title,
          updatedAt: Date.now(),
        },
        note.id
      );
      setNote(res.data);
      setIsOpen(false);
    } catch (err) {
      setError('Failed to rename note');
      console.error('Failed to rename note: ', err);
    }
    reset({
      title: '',
    });
    setSaving(false);
  };

  return (
    <DialogRoot modal={true} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            {error ? <ErrAlert error={error} mb={20} /> : null}
            <Field>
              <Controller
                name='title'
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type='text'
                    value={value}
                    onChange={onChange}
                    placeholder={note.title}
                  />
                )}
              />
            </Field>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant='outline' onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              type='submit'
              className='button1'
              variant='solid'
              disabled={saving}
            >
              Rename note
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger onClick={() => setIsOpen(false)} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangeTitle;
