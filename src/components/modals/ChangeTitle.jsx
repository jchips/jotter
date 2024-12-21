import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
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
import { useAuth } from '@/hooks/useAuth';
import api from '@/util/api';

const ChangeTitle = (props) => {
  const { isOpen, setIsOpen, type, notes, setNote, setFolders, note, folder } =
    props;
  const [error, setError] = useState('');
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = async (titleControl) => {
    try {
      setError('');
      let res;
      switch (type) {
        case 'note':
          res = await api.updateNote(
            {
              title: titleControl.title,
              updatedAt: Date.now(),
            },
            note.id
          );
          setNote(res.data);
          break;
        case 'folder':
          break;
      }
      console.log('res', res.data); // delete later
    } catch (err) {
      setError('Failed to rename' + type);
      console.error(err);
    }
    reset({
      title: '',
    });
    setIsOpen(false);
  };
  return (
    <DialogRoot modal={true} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {type}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            {error ? (
              <div>
                <Alert status='error' title={error} />
              </div>
            ) : null}
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
                    placeholder={type === 'note' ? note.title : folder.title}
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
            <Button type='submit' className='button1' variant='solid'>
              Rename {type}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger onClick={() => setIsOpen(false)} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ChangeTitle;
