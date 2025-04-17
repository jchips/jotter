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

const ExitNote = ({ openExit, setOpenExit, noteId }) => {
  const navigate = useNavigate();

  // navigate to preview page
  const onSubmit = () => {
    navigate(`/view/${noteId}`);
  };

  return (
    <DialogRoot modal={true} open={openExit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exit editor</DialogTitle>
        </DialogHeader>
        <DialogBody>
          Are you sure that you want to exit the editor without saving?
          <br />
          <br />
          <span className='small-text'>
            This will discard any unsaved edits.
          </span>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant='outline' onClick={() => setOpenExit(false)}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button className='button4' variant='solid' onClick={onSubmit}>
            Yes, exit
          </Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={() => setOpenExit(false)} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ExitNote;
