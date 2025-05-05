import { Button, HStack } from '@chakra-ui/react';
import { LuDownload, LuUpload, LuPenLine } from 'react-icons/lu';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const ViewFooter = (props) => {
  const { handleEdit, handleExit, setImportOpen, exportNote } = props;
  const { width } = useWindowDimensions();

  return (
    <HStack className='footer'>
      <HStack>
        <Button className='button2' variant='solid' onClick={handleExit}>
          Exit note
        </Button>
        <Button
          className='button5 ex-im-btn'
          onClick={() => setImportOpen(true)}
          title='Import note'
          aria-label='Import'
        >
          <LuUpload />
          {width > 768 ? 'Import' : null}
        </Button>
        <Button
          className='button5 ex-im-btn'
          onClick={exportNote}
          title='Export note'
          aria-label='Export'
        >
          <LuDownload />
          {width > 768 ? 'Export' : null}
        </Button>
      </HStack>
      <Button
        className='button1'
        variant='solid'
        onClick={handleEdit}
        aria-label='Edit note'
      >
        {width > 350 ? 'Edit note' : <LuPenLine />}
      </Button>
    </HStack>
  );
};

export default ViewFooter;
