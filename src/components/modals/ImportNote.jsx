import { useState } from 'react';
import { Text } from '@chakra-ui/react';
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
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
import '../Note/Preview.scss';

const ImportNote = (props) => {
  const { importOpen, setImportOpen, importNote } = props;
  const [selectedFile, setSelectedFile] = useState(null);

  // Grabs the .md file that user selected
  const handleFileChange = async (e) => {
    if (e.acceptedFiles.length > 0) {
      setSelectedFile(e.acceptedFiles[0]);
    }
  };

  // Imports the .md file that user selected
  const handleSubmitFile = () => {
    importNote(selectedFile);
  };

  return (
    <DialogRoot modal={true} open={importOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitFile} target='_self'>
          <DialogBody>
            <div className='dialog-msg-wrapper'>
              <Text className='dialog-msg1'>
                Choose an (.md) file to import
              </Text>
              <Text className='small-text'>
                This will <strong>replace all</strong> the text that the note
                currently has in it.
              </Text>
            </div>
            <FileUploadRoot accept={['.md']} onFileChange={handleFileChange}>
              <FileUploadTrigger asChild>
                <Button variant='outline' size='sm'>
                  Select file
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant='outline' onClick={() => setImportOpen(false)}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button type='submit' className='button1' variant='solid'>
              <Text>
                {!selectedFile?.name
                  ? 'Import file'
                  : `Import '${selectedFile?.name}'`}
              </Text>
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger onClick={() => setImportOpen(false)} />
      </DialogContent>
    </DialogRoot>
  );
};

export default ImportNote;
