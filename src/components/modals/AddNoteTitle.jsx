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

const AddNoteTitle = (props) => {
  const { isOpen, setIsOpen, selectedOption, notes, setNotes, setFolders } =
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
      switch (selectedOption) {
        case 'note':
          console.log('user', user); // delete later
          res = await api.addNote({
            title: titleControl.title,
            content: '',
            userId: user.id,
            // folderId:
          });
          setNotes([...notes, res.data]);
          break;
        case 'folder':
          res = await api.addFolder({
            title: titleControl.title,
            userId: user.id,
            // parentId:
            // path:{}
          });
          // setFolders(res.data);
          break;
      }
      console.log('res', res.data); // delete later
    } catch (err) {
      setError('Failed to create ' + selectedOption);
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
          <DialogTitle>Add {selectedOption}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            {error ? (
              <div>
                <Alert status='error' title={error} />
              </div>
            ) : null}
            <Field label='Title'>
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
                    placeholder={`Give ${selectedOption} a title`}
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
              Create {selectedOption}
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger onClick={() => setIsOpen(false)} />
      </DialogContent>
    </DialogRoot>
  );
};

export default AddNoteTitle;
